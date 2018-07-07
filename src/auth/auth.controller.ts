import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokenPayload } from './auth.interface';
import { Api, EApiErrorCode, IApiResult } from '../api';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Get('token')
  async createToken(): Promise<IApiResult<ITokenPayload>> {
    const tokenPayload: ITokenPayload = await this.authService.createToken();

    if (tokenPayload) {
      return Api.result<ITokenPayload>(tokenPayload);
    } else {
      Api.error<ITokenPayload>(HttpStatus.BAD_REQUEST, {
        code: EApiErrorCode.BAD_REQUEST,
      });
    }
  }
}