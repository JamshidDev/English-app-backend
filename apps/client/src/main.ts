import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClientModule } from './client.module';
import { GlobalExceptionFilter } from '@shared/common/filters/global-exception.filter';
import { ResponseInterceptor } from '@shared/common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('ClientApp');
  const app = await NestFactory.create(ClientModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('EasyEnglish Client API')
    .setDescription('Client API for English Learning Telegram Mini App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.CLIENT_PORT || 3000;
  await app.listen(port);

  logger.log(`Client API running on: http://localhost:${port}`);
  logger.log(`Client Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
