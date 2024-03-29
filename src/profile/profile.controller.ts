import {
  Body,
  Controller,
  FileInterceptor,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request, UploadedFile,
  UseGuards,
  UseInterceptors, UsePipes,
} from '@nestjs/common';
import { Api, IApiResult, IApiResultList, IApiResultOne } from '../api';
import { ValidationPipe } from '../validation.pipe';
import { Agent } from '../agent/agent.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdateProfilePasswordDto } from './profile.dto';
import { IFile } from '../upload.service';
import { Advert } from '../advert/advert.entity';

@Controller('/api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;

    return await this.profileService.getProfile(user.id);
  }

  @Get('adverts')
  @UseGuards(AuthGuard('jwt'))
  async adverts(@Request() req): Promise<IApiResult<IApiResultList<Advert>>> {
    const { user } = req;

    return await this.profileService.getAdverts(user.id);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(@Request() req, @Body() dto: UpdateProfileDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;
    return await this.profileService.update(user.id, dto);
  }

  @Patch('update-password')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async passwordChange(
    @Request() req,
    @Body() dto: UpdateProfilePasswordDto,
  ): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;
    return await this.profileService.updatePassword(user.id, dto);
  }

  @Post('update-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Request() req,
    @UploadedFile() file: IFile,
  ) {
    const { user } = req;
    return await this.profileService.updateAvatar(user.id, file);
  }
}
