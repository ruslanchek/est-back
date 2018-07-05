import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyService } from './dummy.service';
import { DummyController } from './dummy.controller';
import { Dummy } from './dummy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dummy])],
  providers: [DummyService],
  controllers: [DummyController],
})
export class DummyModule {}