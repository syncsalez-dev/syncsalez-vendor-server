import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { HttpExceptionFilter } from 'src/helpers/http-exception.filter';
=======
import { HttpExceptionFilter } from 'helpers/http-exception.filter';
>>>>>>> 3da130db1ff9c39f3616c7b16fc8baf53748443c
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  console.log('API Gateway running on port 3000...');
}
bootstrap();
