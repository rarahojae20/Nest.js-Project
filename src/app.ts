//app.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'module/app.module';
import { Middleware } from 'middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  if (process.env.NODE_ENV == 'dev') app.use(Middleware);
  await app.listen(3000);
}
bootstrap();
