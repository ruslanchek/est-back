import {
  Get,
  Controller,
  Query,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Patch,
  Put,
  Param,
  UseGuards,
  Request,
  UseInterceptors, FileInterceptor, UploadedFile,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { Advert } from './advert.entity';
import { CreateAdvertDto, UpdateAdvertDto } from './advert.dto';
import { ValidationPipe } from '../validation.pipe';
import { Api, IApiResult, IApiResultCreate, IApiResultList, IApiResultOne } from '../api';
import { AuthGuard } from '@nestjs/passport';
import { IFile } from '../upload.service';

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
  async create(@Request() req, @Body(new ValidationPipe()) dto: CreateAdvertDto): Promise<IApiResult<IApiResultCreate>> {
    const { user } = req;

    return await this.advertService.insert(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param() params, @Body(new ValidationPipe()) dto: UpdateAdvertDto): Promise<IApiResult<IApiResultOne<Advert>>> {
    const { user } = req;

    return await this.advertService.update(user.id, params.id, dto);
  }

  // @Post('add-images')
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FileInterceptor('file'))
  // async updateAvatar(
  //   @Request() req,
  //   @UploadedFile() file: IFile,
  // ) {
  //   const { user } = req;
  //
  //   return await this.profileService.updateAvatar(user.id, file);
  // }
}
