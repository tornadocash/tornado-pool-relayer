import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiService } from './api.service';
import { ApiController } from './api.controller';

import { QueueModule } from '@/modules';

@Module({
  imports: [ConfigModule, QueueModule],
  providers: [ApiService],
  controllers: [ApiController],
  exports: [],
})
export class ApiModule {}
