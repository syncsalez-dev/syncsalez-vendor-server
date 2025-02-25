// // export * from './auth.module'; // Re-export the auth module
// // // export * from './main'; // Or ensure the correct export
// // src/main.ts in sync-vendor subapp

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Transport, ClientsModule } from '@nestjs/microservices';  // For NATS
// import { PrismaService } from './prisma/prisma.service';  // For Prisma integration

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Setup NATS client for subscribing to events
//   app.connectMicroservice({
//     transport: Transport.NATS,
//     options: {
//       servers: ['nats://localhost:4222'],  // NATS server URL (could be Docker or external)
//     },
//   });

//   // Prisma setup (Optional: Can be used globally across services)
//   const prismaService = app.get(PrismaService);
//   await prismaService.onModuleInit();  // Ensure Prisma connects to DB

//   await app.startAllMicroservices(); // Start the microservices (NATS) communication
//   await app.listen(3001);  // HTTP server for REST APIs (Different port for sync-vendor)
// }

// bootstrap();
