import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { baseConfig } from './config';
import { QueueModule } from './modules';
import { CommunicationsModule } from './communication';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [baseConfig],
      isGlobal: true,
    }),
    QueueModule,
    CommunicationsModule,
  ],
})
export class AppModule {}
