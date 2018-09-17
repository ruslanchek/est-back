import { Module } from '@nestjs/common';
import { FakerService } from './faker.service';
import { FakerController } from './faker.controller';

@Module({
  imports: [],
  providers: [
    FakerService,
  ],
  controllers: [
    FakerController,
  ],
})
export class FakerModule {
}