"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const auth_module_1 = require("./auth.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.NATS,
        options: {
            servers: [process.env.NATS_SERVER],
            queue: 'auth-service',
        },
    });
    await app.listen();
    console.log('Auth Service running on NATS...');
}
bootstrap();
