import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

    const configService = app.get(ConfigService);
    await app.listen(configService.get('base.port'));
  } catch (err) {
    console.log('err', err.message);
  }
}

bootstrap();
