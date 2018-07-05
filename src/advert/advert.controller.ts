import { Get, Controller, Query, Post, HttpStatus, HttpException } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';
import { IApiResult, IApiResultCreate } from '../interface/api.interface';

@Controller('/api/advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {
  }

  @Get()
  async list(): Promise<Advert[]> {
    return await this.advertService.findAll();
  }

  @Post()
  async create(): Promise<IApiResult<IApiResultCreate>> {
    return await this.advertService.insert({
      name: 'asdasd',
    });
  }
}
