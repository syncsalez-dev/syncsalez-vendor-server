// apps/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service'; // Import PrismaService here

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService], // Provide PrismaService here
})
export class AuthModule {}
