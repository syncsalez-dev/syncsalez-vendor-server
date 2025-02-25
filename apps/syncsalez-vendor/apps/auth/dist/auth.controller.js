"use strict";
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// // apps/auth/auth.controller.ts
// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { AuthService } from './auth.service';
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
exports.AuthController = void 0;
// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}
//   @Get()
//   getHello(): string {
//     return this.authService.getHello();
//   }
//   @Post('login')
//   async login(@Body() body: { email: string; password: string }) {
//     const user = await this.authService.findUserByEmail(body.email);
//     if (!user) {
//       throw new Error('User not found');
//     }
//     // Authentication logic (password check, etc.)
//     return user;
//   }
//   @Post('register')
//   async register(@Body() body: { email: string; password: string }) {
//     const newUser = await this.authService.createUser(
//       body.email,
//       body.password,
//     );
//     return newUser;
//   }
// }
// src/auth/auth.controller.ts
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service"); // Import your service
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // POST /auth/create-user
    async createUser(email, password) {
        return this.authService.createUser(email, password);
    }
    // GET /auth/find-user-by-email/:email
    async findUserByEmail(email) {
        return this.authService.findUserByEmail(email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('create-user'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('find-user-by-email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findUserByEmail", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth') // Define base route
    ,
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
