"use strict";
// // export * from './auth.module'; // Re-export the auth module
// // // export * from './main'; // Or ensure the correct export
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth.module");
const microservices_1 = require("@nestjs/microservices"); // Correct import
const prisma_service_1 = require("./prisma.service"); // For Prisma integration
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_module_1.AuthModule);
    // Setup NATS client for subscribing to events
    app.connectMicroservice({
        transport: microservices_1.Transport['NATS'],
        options: {
            servers: ['nats://127.0.0.1:4222'], // NATS server URL (could be Docker or external)
        },
    });
    // Prisma setup (Optional: Can be used globally across services)
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.onModuleInit(); // Ensure Prisma connects to DB
    await app.startAllMicroservices(); // Start the microservices (NATS) communication
    await app.listen(3001); // HTTP server for REST APIs (Different port for sync-vendor)
}
void bootstrap();
