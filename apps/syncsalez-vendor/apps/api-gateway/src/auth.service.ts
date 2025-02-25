// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client'; // Prisma's generated model type
import { PrismaService } from './prisma.service'; // PrismaService to interact with the database

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    const user = await this.prisma.userModel.findUnique({
      where: { email },
    });

    if (user === null) {
      throw new Error('User not found');
    }

    return user; // Return the user with the correct type
  }

  async createUser(email: string, password: string): Promise<UserModel> {
    return this.prisma.userModel.create({
      data: { email, password },
    });
  }
}
