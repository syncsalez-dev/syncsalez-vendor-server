import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const prismaOptions: Prisma.PrismaClientOptions = {
      log: ['query', 'info', 'warn', 'error'], // Add your PrismaClient options here
    };
    super(prismaOptions);
  }

  async onModuleInit() {
    try {
      console.log('Initializing Prisma Service...');
      await this.$connect(); // Ensures Prisma connects to the DB
      console.log('Prisma connected successfully');
    } catch (error) {
      console.error('Error initializing PrismaService:', error);
    }
  }
}
