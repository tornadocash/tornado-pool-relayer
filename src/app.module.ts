import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { baseConfig } from '@/config';
import { QueueModule, ApiModule } from '@/modules';
import { setHeadersMiddleware } from '@/modules/api/set-headers.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(setHeadersMiddleware).forRoutes('/');
  }
}
