// apps/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
// import { PrismaService } from './prisma/prisma.service'; // Import PrismaService here

@Module({
  controllers: [StoreController],
  providers: [StoreService], // Provide PrismaService here
})
export class StoreModule {}
