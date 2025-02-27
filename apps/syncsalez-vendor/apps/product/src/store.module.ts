import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
<<<<<<< HEAD
import { PrismaService } from 'src/prisma.service';
=======
import { PrismaService } from 'prisma/prisma.service';
>>>>>>> 3da130db1ff9c39f3616c7b16fc8baf53748443c

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
