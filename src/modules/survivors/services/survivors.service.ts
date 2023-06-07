import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import {
  CreateAdminDto,
  CreateSurvivorDto,
  SurvivorReportResponse,
} from '../dto/survivor.dto';
import { UpdateSurvivorDto } from '../dto/survivor.dto';
import { Survivor } from '../entities/survivor.entity';
import { Location } from '../../locations/entities/location.entity';

@Injectable()
export class SurvivorsService {
  constructor(
    @InjectRepository(Survivor)
    private userRepository: Repository<Survivor>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createSurvivorDto: CreateSurvivorDto | CreateAdminDto) {
    const user = await this.userRepository.findOne({
      email: createSurvivorDto.email,
    });

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const createdSurvivor = await this.userRepository.create(createSurvivorDto);
    const saveSurvivor = await this.userRepository.save(createdSurvivor);
    delete saveSurvivor.password;
    delete saveSurvivor.refreshToken;
    return saveSurvivor;
  }

  async findAll() {
    // include last location of user
    const survivors = await this.userRepository
      .createQueryBuilder('survivors')
      .leftJoinAndSelect('survivors.lastLocation', 'lastLocation')
      // survivor inventory
      .leftJoinAndMapMany(
        'survivors.inventory',
        'inventory',
        'inventory',
        'inventory.userId = survivors.id',
      )
      .getMany();
    return survivors.map((survivor) => {
      const { ...result } = survivor;
      return result;
    });
  }

  async findByEmailAndGetPassword(email: string) {
    return await this.userRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { email },
    });
  }

  async findOne(id: number) {
    // get last location of user
    const lastLocation = await this.locationRepository.findOne({
      select: ['latitude', 'longitude'],
      where: { userId: id },
      order: { createdAt: 'DESC' },
    });
    const details = await this.userRepository.findOne(id);
    return { ...details, lastLocation };
  }

  async findOwn(id: number) {
    // get last location of user
    const lastLocation = await this.locationRepository.findOne({
      select: ['latitude', 'longitude'],
      where: { userId: id },
      order: { createdAt: 'DESC' },
    });
    const details = await this.userRepository.findOne(id);
    return { ...details, lastLocation };
  }

  async findById(userId: number) {
    return await this.userRepository.findOneOrFail(userId);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneOrFail({
      where: { email },
    });
  }

  // Number of Healthy Survivors for last 30 days base on createdAt using createQueryBuilder
  async getHealthySurvivors() {
    const survivorCountInPast30days = await this.userRepository
      .createQueryBuilder('survivors')
      .select('COUNT(*)', 'count')
      .andWhere('survivors.createdAt >= :createdAt', {
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
      })
      .getRawOne();

    const healthySurvivors = await this.userRepository
      .createQueryBuilder('survivors')
      .select('COUNT(*)', 'count')
      .where('survivors.infected = :infected', { infected: false })
      .andWhere('survivors.createdAt >= :createdAt', {
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
      })
      .getRawOne();

    // calculate percentage of healthy survivors
    const percentage = (
      (parseInt(healthySurvivors.count) /
        parseInt(survivorCountInPast30days.count)) *
      100
    ).toFixed(2);
    healthySurvivors.percentage = percentage;
    healthySurvivors.count = parseInt(healthySurvivors.count);
    return healthySurvivors;
  }

  // Number of Infected Survivors for last 30 days base on createdAt using createQueryBuilder
  async getInfectedSurvivors(): Promise<SurvivorReportResponse> {
    const survivorCountInPast30days = await this.userRepository
      .createQueryBuilder('survivors')
      .select('COUNT(*)', 'count')
      .andWhere('survivors.createdAt >= :createdAt', {
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
      })
      .getRawOne();

    const infectedSurvivors = await this.userRepository

      .createQueryBuilder('survivors')
      .select('COUNT(*)', 'count')
      .where('survivors.infected = :infected', { infected: true })
      .andWhere('survivors.createdAt >= :createdAt', {
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
      })
      .getRawOne();

    // calculate percentage of infected survivors
    const percentage = (
      (parseInt(infectedSurvivors.count) /
        parseInt(survivorCountInPast30days.count)) *
      100
    ).toFixed(2);
    infectedSurvivors.percentage = percentage;
    infectedSurvivors.count = parseInt(infectedSurvivors.count);
    return infectedSurvivors;
  }

  // this update user info without password and excludes password field
  async update(id: number, updateSurvivorDto: UpdateSurvivorDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateSurvivorDto,
    });
    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }
    return this.userRepository.save(user);
  }

  async updatePassword(id: number, oldPassword: string, password: string) {
    // check if old password match
    const current = await this.userRepository.findOne(id, {
      select: ['id', 'password'],
    });
    const isMatch = await bcrypt.compare(oldPassword, current.password);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    const user = await this.userRepository.preload({
      id,
      password: await bcrypt.hash(password, 10),
    });
    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`Survivor with id ${id} does not exist`);
    }

    return this.userRepository.remove(user);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    //crypto is a node module, and bcrypt the maximum length of the hash is 60 characters, and token is longer than that, so we need to hash it
    const hash = createHash('sha256').update(refreshToken).digest('hex');

    const currentHashedRefreshToken = await bcrypt.hashSync(hash, 10);
    return await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    await this.findById(userId);

    return this.userRepository.update(
      { id: userId },
      {
        refreshToken: null,
      },
    );
  }

  // percentage of non-infected survivors
  async getNonInfectedPercentage() {
    const nonInfectedCount = await this.userRepository.count({
      where: { infected: false },
    });
    const totalSurvivors = await this.userRepository.count();
    const percentage = (nonInfectedCount / totalSurvivors) * 100;
    return percentage;
  }

  // percentage of infected survivors
  async getInfectedPercentage() {
    const infectedCount = await this.userRepository.count({
      where: { infected: true },
    });
    const totalSurvivors = await this.userRepository.count();
    const percentage = (infectedCount / totalSurvivors) * 100;
    return percentage;
  }

  async getSurvivorIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id', 'refreshToken', 'role'],
      where: { id: userId },
    });

    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return { id: user.id, role: user.role };
    }
  }
}
