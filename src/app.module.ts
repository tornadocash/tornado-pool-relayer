import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { baseConfig } from '@/config';
import { QueueModule, StatusModule } from '@/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig],
      isGlobal: true,
    }),
    QueueModule,
    StatusModule,
  ],
})
export class AppModule {}
