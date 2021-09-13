import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { GasPriceService, ProviderService } from '@/services';

import { TransactionProcessor } from './transaction.processor';

import bullConfig from '@/config/bull.config';

@Module({
  imports: [BullModule.registerQueue(bullConfig())],
  providers: [GasPriceService, ProviderService, TransactionProcessor],
  exports: [BullModule],
})
export class QueueModule {}
