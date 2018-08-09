import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module';
import { MailingService } from '../mailing.service';
import { AuthService } from '../auth/auth.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../agent/agent.entity';
import { ProfileService } from './profile.service';
import { UploadService } from '../upload.service';
import { AdvertService } from '../advert/advert.service';
import { Advert } from '../advert/advert.entity';

@Module({
  imports: [
    AgentModule,
    TypeOrmModule.forFeature([
      Agent,
      Advert,
    ]),
  ],
  controllers: [
    ProfileController,
  ],
  providers: [
    AuthService,
    MailingService,
    ProfileService,
    UploadService,
  ],
})
export class ProfileModule {
}