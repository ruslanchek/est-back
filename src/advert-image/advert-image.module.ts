import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingService } from '../mailing.service';
import { UploadService } from '../upload.service';
import { AdvertImage } from './advert-image.entity';
import { AdvertService } from '../advert/advert.service';
import { AdvertImageController } from './advert-image.controller';
import { Advert } from '../advert/advert.entity';
import { AdvertImageService } from './advert-image.service';
import { AdvertModule } from '../advert/advert.module';

@Module({
  imports: [
    AdvertModule,
    TypeOrmModule.forFeature([
      AdvertImage,
      Advert,
    ]),
  ],
  providers: [
    AdvertImageService,
    MailingService,
    UploadService,
  ],
  controllers: [
    AdvertImageController,
  ],
  exports: [
    AdvertImageService,
  ],
})
export class AdvertImageModule {
}