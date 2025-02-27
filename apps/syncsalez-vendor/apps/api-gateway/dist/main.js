"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
<<<<<<< HEAD
const http_exception_filter_1 = require("./helpers/http-exception.filter");
=======
const http_exception_filter_1 = require("../helpers/http-exception.filter");
>>>>>>> 3da130db1ff9c39f3616c7b16fc8baf53748443c
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
<<<<<<< HEAD
    await app.listen(3000);
=======
    await app.listen(4000);
>>>>>>> 3da130db1ff9c39f3616c7b16fc8baf53748443c
    console.log('API Gateway running on port 3000...');
}
bootstrap();
