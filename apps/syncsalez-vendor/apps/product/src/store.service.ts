import { Injectable, BadRequestException } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaService } from './prisma.service';
=======
import { PrismaService } from '../prisma/prisma.service';
>>>>>>> 3da130db1ff9c39f3616c7b16fc8baf53748443c
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDto } from './dto/store.dto';
import { VerifyStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createStore(
    createStoreDto: CreateStoreDto,
    userId: string,
  ): Promise<StoreDto> {
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
    } catch (error) {
      throw new BadRequestException(`Failed to create store: ${error.message}`);
    }
  }

  async verifyStore(verifyStoreDto: VerifyStoreDto): Promise<StoreDto> {
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
}
