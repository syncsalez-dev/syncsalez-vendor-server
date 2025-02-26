"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const store_module_1 = require("./store.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(store_module_1.StoreModule, {
        transport: microservices_1.Transport.NATS,
        options: {
            servers: [process.env.NATS_SERVER],
            queue: 'store-service',
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    await app.listen();
    console.log('Store Service running on NATS...');
}
bootstrap();
