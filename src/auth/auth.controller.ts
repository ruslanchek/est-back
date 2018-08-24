import { Body, Controller, Param, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokenPayload } from './auth.interface';
import { IApiResult } from '../api';
import { ValidationPipe } from '../validation.pipe';
import { AuthDto } from './auth.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Param() params, @Body() dto: AuthDto): Promise<IApiResult<ITokenPayload>> {
    return await this.authService.login(dto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Param() params, @Body() dto: AuthDto): Promise<IApiResult<ITokenPayload>> {
    return await this.authService.register(dto);
  }
}
