import { Get, Controller, Query, Post, HttpStatus, HttpException, Body } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';
import { IApiResult, IApiResultCreate } from '../interface/api.interface';
import { CreateAdvertDto } from './advert.dto';
import { ValidationPipe } from '../validation.pipe';

@Controller('/api/advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {
  }

  @Get()
  async list(): Promise<Advert[]> {
    return await this.advertService.findAll();
  }

  @Post()
  async create(@Body(new ValidationPipe()) createAdvertDto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.advertService.insert(createAdvertDto);
  }
}
