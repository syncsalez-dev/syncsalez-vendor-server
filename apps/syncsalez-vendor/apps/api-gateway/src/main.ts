// // export * from './auth.module'; // Re-export the auth module
// // // export * from './main'; // Or ensure the correct export

import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices'; // Correct import
import { PrismaService } from './prisma.service'; // For Prisma integration

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Setup NATS client for subscribing to events
  app.connectMicroservice({
    transport: Transport['NATS'],
    options: {
      servers: ['nats://127.0.0.1:4222'], // NATS server URL (could be Docker or external)
    },
  });

  // Prisma setup (Optional: Can be used globally across services)
  const prismaService: PrismaService = app.get<PrismaService>(PrismaService);

  await prismaService.onModuleInit(); // Ensure Prisma connects to DB

  await app.startAllMicroservices(); // Start the microservices (NATS) communication
  await app.listen(3001); // HTTP server for REST APIs (Different port for sync-vendor)
}

void bootstrap();
