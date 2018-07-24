import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module';
import { MailingService } from '../mailing.service';
import { AuthService } from '../auth/auth.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../agent/agent.entity';
import { ProfileService } from './profile.service';
import { UploadService } from '../upload.service';

@Module({
  imports: [AgentModule, TypeOrmModule.forFeature([Agent])],
  controllers: [ProfileController],
  providers: [AuthService, MailingService, ProfileService, UploadService],
})
export class ProfileModule {}