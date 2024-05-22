import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonOptions } from './winston.config';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(WinstonOptions)
  });
  app.useGlobalPipes(new ValidationPipe(
  {
    whitelist: true,
    transform: true
  }
  ));
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Daily Expense-Backend')
    .setDescription('Daily Expense Api Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  //Cors comment
  app.enableCors();
  const port = process.env.APP_PORT || 3000 ;
  await app.listen(port);
}
bootstrap();
