import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

import { StoreDto, CreateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  async createStore(
    createStoreDto: CreateStoreDto,
    userId: string,
  ): Promise<StoreDto> {
    try {
      const payload = { createStoreDto, userId };
      const response = this.natsClient.send('store.create', payload);
      return await lastValueFrom(response);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create store via NATS: ${error.message}`,
      );
    }
  }

  async verifyStore(storeId: string): Promise<StoreDto> {
    const response = this.natsClient.send('store.verify', { id: storeId });
    return lastValueFrom(response);
  }
}
