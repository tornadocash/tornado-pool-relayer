import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import config from 'config';
import { AdvancedSettings } from 'bull';

import { RedisOptions } from 'ioredis';
import { WithdrawalProcessor } from './withdrawal.processor';

const redis = config.get<RedisOptions>('bull.redis');
const settings = config.get<AdvancedSettings>('bull.settings');

@Module({
  imports: [
    BullModule.registerQueue({
      redis,
      settings,
      name: 'withdrawal',
    }),
  ],
  providers: [WithdrawalProcessor],
  exports: [BullModule],
})
export class QueueModule {}
