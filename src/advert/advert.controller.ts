import { Get, Controller, Query, Post, HttpStatus, HttpException, Body, Patch, Put, Param, UseGuards } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { ValidationPipe } from '../validation.pipe';
import { IApiResult, IApiResultCreate, IApiResultList, IApiResultUpdate, IApiResultOne } from '../api';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  async create(@Body(new ValidationPipe()) dto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    return await this.advertService.insert(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param() params, @Body(new ValidationPipe()) dto: UpdateAdvertDto): Promise<IApiResult<IApiResultUpdate>> {
    return await this.advertService.update(params.id, dto);
  }
}
