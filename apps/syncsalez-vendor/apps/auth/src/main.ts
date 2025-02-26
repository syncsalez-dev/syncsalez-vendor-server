import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_SERVER],
      queue: 'auth-service',
    },
  });
  await app.listen();
  console.log('Auth Service running on NATS...');
}
bootstrap();
