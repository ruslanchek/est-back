import { Body, Controller, HttpException, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokenPayload } from './auth.interface';
import { IApiResult } from '../api';
import { ValidationPipe } from '../validation.pipe';
import { AuthAgentDto, UpdateAgentPasswordDto } from '../agent/agent.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  async login(@Param() params, @Body(new ValidationPipe()) dto: AuthAgentDto): Promise<IApiResult<ITokenPayload>> {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Param() params, @Body(new ValidationPipe()) dto: AuthAgentDto): Promise<IApiResult<ITokenPayload>> {
    return await this.authService.register(dto);
  }
}
