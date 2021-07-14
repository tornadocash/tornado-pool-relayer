import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StatusService } from './stat.service';
import { StatusController } from './stat.controller';

import { QueueModule } from '@/modules';

@Module({
  imports: [ConfigModule, QueueModule],
  providers: [StatusService],
  controllers: [StatusController],
  exports: [],
})
export class StatusModule {}
