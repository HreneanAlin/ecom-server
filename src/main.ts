import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WEB_URL } from './common/helpers/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: [WEB_URL, 'https://studio.apollographql.com'],
  });
  await app.listen(4008);
}
bootstrap();
