import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { GasPriceService, ProviderService } from '@/services';

import { WithdrawalProcessor } from './withdrawal.processor';

import bullConfig from '@/config/bull.config';

@Module({
  imports: [BullModule.registerQueue(bullConfig())],
  providers: [GasPriceService, ProviderService, WithdrawalProcessor],
  exports: [BullModule],
})
export class QueueModule {}
