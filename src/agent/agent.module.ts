import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Agent } from './agent.entity';
import { MailingService } from 'mailing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  providers: [AgentService, MailingService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}