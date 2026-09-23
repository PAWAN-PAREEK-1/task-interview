import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const serverPort = process.env.PORT || 3000;
  await app.listen(serverPort);
  Logger.log(
    `server is running on: ${serverPort}`,
  );
}

bootstrap();
