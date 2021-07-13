import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}

bootstrap()
  .then((result) => console.log('result', result))
  .catch((e) => console.log('error', e.message));
