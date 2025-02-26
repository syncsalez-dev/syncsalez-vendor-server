import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { StoreModule } from './store.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(StoreModule, {
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_SERVER],
      queue: 'store-service',
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen();
  console.log('Store Service running on NATS...');
}
bootstrap();
