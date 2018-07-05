import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dummy } from './dummy.entity';

@Injectable()
export class DummyService {
  constructor(
    @InjectRepository(Dummy)
    private readonly dummyServiceRepository: Repository<Dummy>,
  ) {}

  async findAll(): Promise<Dummy[]> {
    return await this.dummyServiceRepository.find();
  }
}