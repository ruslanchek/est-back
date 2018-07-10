import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AgentModule } from '../agent/agent.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [AgentModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}