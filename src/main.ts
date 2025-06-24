import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.setGlobalPrefix('api/v1');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Desafio ISI Dev - Products & Coupons API')
    .setDescription('Backend API for product management with discount coupons')
    .setVersion('1.0')
    .addTag('products', 'Product management operations')
    .addTag('coupons', 'Coupon management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
