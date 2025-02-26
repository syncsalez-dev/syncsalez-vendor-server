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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let StoreService = class StoreService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createStore(createStoreDto, userId) {
        try {
            const store = await this.prisma.store.create({
                data: createStoreDto,
            });
            // Create the admin role
            const adminRole = await this.prisma.role.create({
                data: {
                    name: 'admin',
                    storeId: store.id,
                },
            });
            // Assign the creator as admin
            await this.prisma.storeUser.create({
                data: {
                    userId, // Now correctly passed from payload
                    storeId: store.id,
                    roleId: adminRole.id,
                },
            });
            // Set default admin permissions
            const permissions = [
                { name: 'VIEW_STORE', value: true },
                { name: 'MANAGE_USERS', value: true },
                { name: 'VIEW_INVENTORY', value: true },
                { name: 'EDIT_INVENTORY', value: true },
                { name: 'VIEW_ORDERS', value: true },
                { name: 'EDIT_ORDERS', value: true },
            ];
            await this.prisma.permission.createMany({
                data: permissions.map((perm) => ({
                    roleId: adminRole.id,
                    name: perm.name,
                    value: perm.value,
                })),
            });
            return {
                id: store.id,
                businessName: store.businessName,
                businessType: store.businessType,
                phoneNumber: store.phoneNumber,
                businessEmail: store.businessEmail,
                businessLocation: store.businessLocation,
                logo: store.logo,
                isVerified: store.isVerified,
                createdAt: store.createdAt,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create store: ${error.message}`);
        }
    }
    async verifyStore(verifyStoreDto) {
        const store = await this.prisma.store.update({
            where: { id: verifyStoreDto.id },
            data: { isVerified: true },
        });
        return {
            id: store.id,
            businessName: store.businessName,
            businessType: store.businessType,
            phoneNumber: store.phoneNumber,
            businessEmail: store.businessEmail,
            businessLocation: store.businessLocation,
            logo: store.logo,
            isVerified: store.isVerified,
            createdAt: store.createdAt,
        };
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoreService);
