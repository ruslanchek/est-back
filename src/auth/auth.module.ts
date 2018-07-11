import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AgentModule } from '../agent/agent.module';
import { JwtStrategy } from './jwt.strategy';
import { MailingService } from '../mailing.service';

@Module({
  imports: [AgentModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailingService],
})
export class AuthModule {}