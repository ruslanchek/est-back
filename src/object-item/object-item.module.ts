import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectItemService } from './object-item.service';
import { ObjectItemController } from './object-item.controller';
import { ObjectItem } from './object-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectItem])],
  providers: [ObjectItemService],
  controllers: [ObjectItemController],
})
export class ObjectItemModule {}