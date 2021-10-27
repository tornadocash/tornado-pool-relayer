import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { GasPriceService, ProviderService, OffchainPriceService } from '@/services';

import { TransactionProcessor } from './transaction.processor';

import bullConfig from '@/config/bull.config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'transaction',
      useFactory: bullConfig,
    }),
  ],
  providers: [GasPriceService, ProviderService, TransactionProcessor, OffchainPriceService],
  exports: [BullModule],
})
export class QueueModule {}
