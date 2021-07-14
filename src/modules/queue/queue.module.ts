import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { WithdrawalProcessor } from './withdrawal.processor';

import bullConfig from '@/config/bull.config';

@Module({
  imports: [
    BullModule.registerQueue({
      ...bullConfig(),
      name: 'withdrawal',
    }),
  ],
  providers: [WithdrawalProcessor],
  exports: [BullModule],
})
export class QueueModule {}
