"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const store_controller_1 = require("./store.controller");
const store_service_1 = require("./store.service");
describe('AppController', () => {
    let appController;
    beforeEach(async () => {
        const app = await testing_1.Test.createTestingModule({
            controllers: [store_controller_1.AppController],
            providers: [store_service_1.AppService],
        }).compile();
        appController = app.get(store_controller_1.AppController);
    });
    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
