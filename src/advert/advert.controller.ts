import { Get, Controller, Query, Post, HttpStatus, HttpException, Body, Patch, Put, Param } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { ValidationPipe } from '../validation.pipe';
import { IApiResult, IApiResultCreate, IApiResultList, IApiResultUpdate, IApiResultOne } from '../api';

@Controller('/api/advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {
  }

  @Get()
  async list(): Promise<IApiResult<IApiResultList<Advert>>> {
    return await this.advertService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<IApiResult<IApiResultOne<Advert>>> {
    return await this.advertService.findOne(params.id);
  }

  @Post()
  async create(@Body(new ValidationPipe()) createAdvertDto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.advertService.insert(createAdvertDto);
  }

  @Patch(':id')
  async update(@Param() params, @Body(new ValidationPipe()) updateAdvertDto: UpdateAdvertDto): Promise<IApiResult<IApiResultUpdate>> {
    return await this.advertService.update(params.id, updateAdvertDto);
  }
}
