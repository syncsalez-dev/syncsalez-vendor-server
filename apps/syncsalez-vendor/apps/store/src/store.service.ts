// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
// import { PrismaService } from './prisma/prisma.service'; // Import PrismaService
// import { UserModel } from '@prisma/client'; // Import User model from Prisma
// import { Prisma } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor() {}

  getHello(): string {
    return 'Hello Store World!';
  }
}
