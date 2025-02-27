"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const common_2 = require("@nestjs/common");
let StoreService = class StoreService {
    constructor(natsClient) {
        this.natsClient = natsClient;
    }
    async createStore(createStoreDto, userId) {
        try {
            const payload = { createStoreDto, userId };
            const response = this.natsClient.send('store.create', payload);
            return await (0, rxjs_1.lastValueFrom)(response);
        }
        catch (error) {
            throw new common_2.BadRequestException(`Failed to create store via NATS: ${error.message}`);
        }
    }
    async verifyStore(storeId) {
        const response = this.natsClient.send('store.verify', { id: storeId });
        return (0, rxjs_1.lastValueFrom)(response);
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('NATS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], StoreService);
