/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// // apps/auth/auth.controller.ts
// import { Controller, Post, Body, Get } from '@nestjs/common';
// import { AuthService } from './auth.service';

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

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service'; // Import your service
import { UserModel } from '@prisma/client'; // Import the User model for types

@Controller('auth') // Define base route
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/create-user
  @Post('create-user')
  async createUser(
    @Body('email') email: string, // Get email from the request body
    @Body('password') password: string, // Get password from the request body
  ): Promise<UserModel> {
    return this.authService.createUser(email, password);
  }

  // GET /auth/find-user-by-email/:email
  @Get('find-user-by-email/:email')
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<UserModel | null> {
    return this.authService.findUserByEmail(email);
  }
}
