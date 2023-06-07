import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/items.entity';
import { CreateItemDto, UpdateItemDto } from '../dto/items.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const createdItem = await this.itemRepository.create(createItemDto);
    const saveItem = await this.itemRepository.save(createdItem);
    return saveItem;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // use preload
    const item = await this.itemRepository.preload({
      id,
      ...updateItemDto,
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return await this.itemRepository.save(item);
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne(id);
  }

  async delete(id: number) {
    // check if item exists
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    const deletedItem = await this.itemRepository.delete(id);
    return deletedItem;
  }
}
