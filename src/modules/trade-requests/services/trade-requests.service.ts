import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeRequest } from '../entities/trade-requests.entity';
import {
  AcceptTradeRequestDto,
  CreateTradeRequestDtoWithUser,
  RejectTradeRequestDto,
} from '../dto/trade-requests.dto';
import { Status } from '../models/status.model';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';
import { InventoryService } from '../../../modules/inventory/services/inventory.service';
import { TradeDetailsService } from '../../../modules/trade-details/services/trade-details.service';

@Injectable()
export class TradeRequestService {
  constructor(
    @InjectRepository(TradeRequest)
    private tradeRequestRepository: Repository<TradeRequest>,
    @InjectRepository(Survivor)
    private survivorRepository: Repository<Survivor>,
    @Inject(InventoryService)
    private readonly inventoryService: InventoryService,

    @Inject(TradeDetailsService)
    private readonly tradeDetailsService: TradeDetailsService,
  ) {}

  async create(createTradeRequestDto: CreateTradeRequestDtoWithUser) {
    const survivor1 = await this.survivorRepository.findOne({
      where: { id: createTradeRequestDto.userId1 },
    });

    const survivor2 = await this.survivorRepository.findOne({
      where: { id: createTradeRequestDto.userId2 },
    });
    createTradeRequestDto.user1 = survivor1;
    createTradeRequestDto.user2 = survivor2;

    const createdTradeRequest = await this.tradeRequestRepository.create(
      createTradeRequestDto,
    );

    const saveTradeRequest = await this.tradeRequestRepository.save(
      createdTradeRequest,
    );

    return saveTradeRequest;
  }

  async findOne(userId: number, id: number) {
    // where userId is either userId1 or userId2
    return await this.tradeRequestRepository.findOne({
      where: [
        { id, userId1: userId },
        { id, userId2: userId },
      ],
    });
  }

  async findOpenTradeRequests(userId: number) {
    // add relations user1 and user2

    return await this.tradeRequestRepository.find({
      where: [
        { userId1: userId, status: Status.PENDING },
        { userId2: userId, status: Status.PENDING },
      ],
      // recently createdAt on top
      order: { createdAt: 'DESC' },
      relations: ['user1', 'user2'],
    });
  }

  // accepted and rejected trade requests
  findTradeHistory(userId: number) {
    return this.tradeRequestRepository.find({
      where: [
        { userId1: userId, status: Status.ACCEPTED },
        { userId2: userId, status: Status.ACCEPTED },
        { userId1: userId, status: Status.REJECTED },
        { userId2: userId, status: Status.REJECTED },
      ],

      order: { updatedAt: 'DESC' },
      relations: ['user1', 'user2'],
    });
  }

  async accept(userId: number, acceptTradeRequestDto: AcceptTradeRequestDto) {
    const tradeRequest = await this.tradeRequestRepository.findOne(
      acceptTradeRequestDto.id,
    );
    // check if the trade request is pending
    if (tradeRequest.status !== Status.PENDING) {
      throw new Error('This trade request is not pending');
    }

    // Change user accept status on trade
    if (tradeRequest.userId1 === userId) {
      tradeRequest.userAccept1 = Status.ACCEPTED;
    } else if (tradeRequest.userId2 === userId) {
      tradeRequest.userAccept2 = Status.ACCEPTED;
    } else {
      throw new Error('This trade request does not belong to you');
    }

    if (
      tradeRequest.userAccept1 === Status.ACCEPTED &&
      tradeRequest.userAccept2 === Status.ACCEPTED
    ) {
      tradeRequest.status = Status.ACCEPTED;
      // Commence exchange of goods here

      // Get Trade Details
      const tradeDetails = await this.tradeDetailsService.findAllDetails(
        acceptTradeRequestDto.id,
      );

      // collect all userId1 items
      const user1Items = tradeDetails.filter(
        (tradeDetail) => tradeDetail.userId === tradeRequest.userId1,
      );
      // collect all userId2 items
      const user2Items = tradeDetails.filter(
        (tradeDetail) => tradeDetail.userId === tradeRequest.userId2,
      );

      // All user1Items will go to user2
      user1Items.forEach(async (user1Item) => {
        // add to user2
        await this.inventoryService.add({
          userId: tradeRequest.userId2,
          itemId: user1Item.itemId,
          quantity: 1,
        });
        // remove from user1
        await this.inventoryService.remove({
          userId: tradeRequest.userId1,
          itemId: user1Item.itemId,
          quantity: 1,
        });
      });

      // All user2Items will go to user1
      user2Items.forEach(async (user2Item) => {
        // add to user1
        await this.inventoryService.add({
          userId: tradeRequest.userId1,
          itemId: user2Item.itemId,
          quantity: 1,
        });
        // remove from user2
        await this.inventoryService.remove({
          userId: tradeRequest.userId2,
          itemId: user2Item.itemId,
          quantity: 1,
        });
      });
    }

    if (!tradeRequest.user1) {
      tradeRequest.user1 = await this.survivorRepository.findOne({
        where: { id: tradeRequest.userId1 },
      });
    }
    if (!tradeRequest.user2) {
      tradeRequest.user2 = await this.survivorRepository.findOne({
        where: { id: tradeRequest.userId2 },
      });
    }

    const updatedTradeRequest = await this.tradeRequestRepository.save(
      tradeRequest,
    );
    return updatedTradeRequest;
  }

  async reject(userId: number, rejectTradeRequestDto: RejectTradeRequestDto) {
    const tradeRequest = await this.tradeRequestRepository.findOne(
      rejectTradeRequestDto.id,
    );
    // check if the trade request is pending
    if (tradeRequest.status !== Status.PENDING) {
      throw new Error('This trade request is not pending');
    }

    // Change user accept status on trade
    if (tradeRequest.userId1 === userId) {
      tradeRequest.userAccept1 = Status.REJECTED;
    } else if (tradeRequest.userId2 === userId) {
      tradeRequest.userAccept2 = Status.REJECTED;
    } else {
      throw new Error('This trade request does not belong to you');
    }

    if (
      tradeRequest.userAccept1 === Status.REJECTED ||
      tradeRequest.userAccept2 === Status.REJECTED
    ) {
      tradeRequest.status = Status.REJECTED;
    }

    const updatedTradeRequest = await this.tradeRequestRepository.save(
      tradeRequest,
    );
    return updatedTradeRequest;
  }
}
