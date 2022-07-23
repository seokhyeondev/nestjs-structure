import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { AppModule } from './common/app/app.module';
import { ValidationErrorException } from './error/exceptions/validation.exception';
import fastifyCookie from 'fastify-cookie';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './providers/prisma/services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipUndefinedProperties: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationErrorException(validationErrors);
      },
    }),
  );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);
  await app.register(fastifyCookie, {});

  const config = new DocumentBuilder().setTitle('Bang API').setDescription('The Bang API description').setVersion('1.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5004, '0.0.0.0');
}
bootstrap();
