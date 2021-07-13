import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StatusService } from './stat.service';
import { StatusController } from './stat.controller';

@Module({
  imports: [ConfigModule],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
