import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GasPriceService, OffchainPriceService, ProviderService, RedisStoreService } from '@/services';

import { TransactionProcessor } from './transaction.processor';

import bullConfig from '@/config/bull.config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'transaction',
      useFactory: bullConfig,
    }),
  ],
  providers: [GasPriceService, ProviderService, TransactionProcessor, OffchainPriceService, RedisStoreService],
  exports: [BullModule],
})
export class QueueModule {}
