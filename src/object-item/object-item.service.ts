import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectItem } from './object-item.entity';

@Injectable()
export class ObjectItemService {
  constructor(
    @InjectRepository(ObjectItem)
    private readonly objectServiceRepository: Repository<ObjectItem>,
  ) {}

  async findAll(): Promise<ObjectItem[]> {
    return await this.objectServiceRepository.find();
  }
}