import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokenPayload } from './auth.interface';
import { Api, EApiErrorCode, IApiResult, IApiResultUpdate } from '../api';
import { ValidationPipe } from '../validation.pipe';
import { LoginAgentDto } from '../agent/agent.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async login(@Param() params, @Body(new ValidationPipe()) dto: LoginAgentDto): Promise<IApiResult<ITokenPayload>> {
    return await this.authService.login(dto);
  }
}
