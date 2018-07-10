import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { Advert } from './advert.entity';
import { MailingService } from 'mailing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Advert])],
  providers: [AdvertService, MailingService],
  controllers: [AdvertController],
})
export class AdvertModule {}