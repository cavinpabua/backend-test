import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { CreateLocationDto } from '../dto/location.dto';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Survivor)
    private survivorRepository: Repository<Survivor>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const createdLocation = await this.locationRepository.create(
      createLocationDto,
    );
    const saveLocation = await this.locationRepository.save(createdLocation);

    const survivor = await this.survivorRepository.findOne({
      where: { id: createLocationDto.userId },
    });
    survivor.lastLocation = saveLocation;
    await this.survivorRepository.save(survivor);

    return saveLocation;
  }

  // find latest location of a user
  async findLatestLocation(userId: number) {
    return await this.locationRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  //   find all location history of a user
  async findAllLocation(userId: number) {
    return await this.locationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  //   find latest location of all users
  async findAllLatestLocation() {
    return await this.locationRepository.query(`
            SELECT DISTINCT ON (user_id) locations.*, survivors.email, survivors.name FROM locations LEFT JOIN
            survivors ON locations.user_id = survivors.id
             ORDER BY locations.user_id, locations.created_at DESC;
        `);
  }
}
