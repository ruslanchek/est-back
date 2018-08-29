import { Module } from '@nestjs/common';
import { EnumController } from './enum.controller';
import { EnumService } from './enum.service';

@Module({
  providers: [
    EnumService,
  ],
  controllers: [
    EnumController,
  ],
})
export class EnumModule {}