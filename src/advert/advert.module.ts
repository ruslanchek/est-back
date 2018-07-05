import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { Advert } from './advert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Advert])],
  providers: [AdvertService],
  controllers: [AdvertController],
})
export class AdvertModule {}