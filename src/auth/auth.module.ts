import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AgentModule } from '../agent/agent.module';
import { JwtStrategy } from './jwt.strategy';
import { MailingService } from '../mailing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../agent/agent.entity';

@Module({
  imports: [
    AgentModule,
    TypeOrmModule.forFeature([
      Agent,
    ]),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    MailingService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}