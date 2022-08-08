import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { RedisStoreService } from '@/services';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
    const configService = app.get(ConfigService);
    const redisStore = app.get(RedisStoreService).getClient();
    await redisStore.clearErrors();
    await app.listen(configService.get('base.port'));
  } catch (err) {
    console.log('err', err.message);
  }
}

bootstrap();
