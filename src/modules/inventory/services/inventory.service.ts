import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto, SpendInventoryDto } from '../dto/inventory.dto';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Survivor)
    private survivorRepository: Repository<Survivor>,
  ) {}

  async add(createInventoryDto: CreateInventoryDto) {
    // check if the user already has the item
    const checkInventory = await this.checkInventory(
      createInventoryDto.userId,
      createInventoryDto.itemId,
    );
    if (checkInventory) {
      // if the user already has the item, add the quantity
      checkInventory.quantity += createInventoryDto.quantity;
      const saveInventory = await this.inventoryRepository.save(checkInventory);
      return saveInventory;
    }

    // if the user doesn't have the item, create a new one
    const createdInventory = await this.inventoryRepository.create(
      createInventoryDto,
    );
    const saveInventory = await this.inventoryRepository.save(createdInventory);
    return saveInventory;
  }

  async remove(createInventoryDto: CreateInventoryDto) {
    // check if the user already has the item
    const checkInventory = await this.checkInventory(
      createInventoryDto.userId,
      createInventoryDto.itemId,
    );
    if (checkInventory) {
      // if the user already has the item, subtract the quantity
      checkInventory.quantity -= createInventoryDto.quantity;
      // SAFEMATH - if the quantity is less than 0, set it to 0
      if (checkInventory.quantity < 0) {
        checkInventory.quantity = 0;
      }
      const saveInventory = this.inventoryRepository.save(checkInventory);
      return saveInventory;
    }
  }

  async spend(userId, spend: SpendInventoryDto) {
    // check if the user already has the item
    const checkInventory = await this.checkInventory(userId, spend.itemId);
    if (checkInventory) {
      // check if user has enough quantity
      if (checkInventory.quantity >= spend.quantity) {
        throw new Error('Not enough quantity');
      }
      // if the user already has enough, subtract the quantity
      checkInventory.quantity -= spend.quantity;
      const saveInventory = this.inventoryRepository.save(checkInventory);
      return saveInventory;
    }
  }

  async checkInventory(userId: number, itemId: number) {
    const checkInventory = await this.inventoryRepository.findOne({
      where: { userId: userId, itemId: itemId },
    });
    return checkInventory;
  }

  async getInventory(id: number) {
    const inventory = await this.inventoryRepository.find({
      where: { userId: id },
    });
    return inventory;
  }

  // This should be useful for the report in counting the
  // average amount of each kind of resource by survivor (e.g. 5 waters per survivor)
  // Average = Total Amount of Resource / Number of Survivors
  async averageResourceAllocation(itemId: number) {
    // get all survivor count
    const totalSurvivors = await this.survivorRepository.count();

    const totalResource = await this.inventoryRepository.count({
      where: { itemId: itemId },
    });
    const average = totalResource / totalSurvivors;
    return average.toFixed(2);
  }
}
