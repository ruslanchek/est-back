import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [AgentModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}