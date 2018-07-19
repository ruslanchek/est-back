import { Body, Controller, HttpException, HttpStatus, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { IApiResult, IApiResultOne } from '../api';
import { ValidationPipe } from '../validation.pipe';
import { Agent } from '../agent/agent.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdateProfilePasswordDto } from './profile.dto';

@Controller('/api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param() params, @Body(new ValidationPipe()) dto: UpdateProfileDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;

    if (user && user.id) {
      return await this.profileService.update(user.id, dto);
    } else {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
  }

  @Patch('update-password')
  @UseGuards(AuthGuard('jwt'))
  async passwordChange(
    @Request() req,
    @Param() params,
    @Body(new ValidationPipe()) dto: UpdateProfilePasswordDto,
  ): Promise<IApiResult<IApiResultOne<Agent>>> {
    const { user } = req;

    if (user && user.id) {
      return await this.profileService.updatePassword(user.id, dto);
    } else {
      throw new HttpException(null, HttpStatus.FORBIDDEN);
    }
  }
}
