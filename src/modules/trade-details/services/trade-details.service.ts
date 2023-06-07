import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeDetails } from '../entities/trade-details.entity';
import { AddTradeDetailsDto } from '../dto/trade-details.dto';

@Injectable()
export class TradeDetailsService {
  constructor(
    @InjectRepository(TradeDetails)
    private tradeDetailRepository: Repository<TradeDetails>,
  ) {}

  async add(createTradeDetailsDto: AddTradeDetailsDto) {
    const createdTradeDetails = await this.tradeDetailRepository.create(
      createTradeDetailsDto,
    );
    const saveTradeDetails = await this.tradeDetailRepository.save(
      createdTradeDetails,
    );
    return saveTradeDetails;
  }

  async remove(id: number) {
    const tradeDetails = await this.tradeDetailRepository.findOne(id);
    await this.tradeDetailRepository.remove(tradeDetails);
    return tradeDetails;
  }

  async findAllDetails(id: number): Promise<TradeDetails[]> {
    return await this.tradeDetailRepository.find({
      where: { requestId: id },
    });
  }
}
