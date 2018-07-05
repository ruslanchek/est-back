import { Get, Controller, Query, Post } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';

@Controller('/api/advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {
  }

  @Get()
  async list(): Promise<Advert[]> {
    return await this.advertService.findAll();
  }

  @Post()
  async add(): Promise<Advert> {
    return await this.advertService.add({
      name: 'asdasd',
    });
  }
}
