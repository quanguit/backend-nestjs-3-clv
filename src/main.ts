import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { CustomLoggerService } from './logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: console,
  });
  const globalPrefix = 'api/v1';

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth()
    .build();

  let document = SwaggerModule.createDocument(app, config);
  // Prepend the global prefix to each path in the Swagger document
  document = {
    ...document,
    paths: Object.keys(document.paths).reduce((acc, key) => {
      const newKey = `/${globalPrefix}${key}`;
      acc[newKey] = document.paths[key];
      return acc;
    }, {}),
  };
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const customLoggerService = app.get(CustomLoggerService);

  app.useLogger(customLoggerService);
  app.useGlobalFilters(new HttpExceptionFilter(customLoggerService));
  await app.listen(3000);
}
bootstrap();
