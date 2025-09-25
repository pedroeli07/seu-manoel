import { Module } from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackingController } from './packing.controller';

@Module({
  providers: [PackingService],
  controllers: [PackingController],
})
export class PackingModule {}


