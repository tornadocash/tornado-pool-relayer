import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { baseConfig } from '@/config';
import { QueueModule, ApiModule } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig],
      isGlobal: true,
    }),
    ApiModule,
    QueueModule,
  ],
})
export class AppModule {}
