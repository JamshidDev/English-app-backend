import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from './admin.module';
import { GlobalExceptionFilter } from '@shared/common/filters/global-exception.filter';
import { ResponseInterceptor } from '@shared/common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('AdminApp');
  const app = await NestFactory.create(AdminModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api/admin');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('EasyEnglish Admin API')
    .setDescription('Admin Panel API for English Learning Telegram Mini App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/admin/docs', app, document);

  const port = process.env.ADMIN_PORT || 3001;
  await app.listen(port);

  logger.log(`Admin API running on: http://localhost:${port}`);
  logger.log(`Admin Swagger: http://localhost:${port}/api/admin/docs`);
}

bootstrap();
