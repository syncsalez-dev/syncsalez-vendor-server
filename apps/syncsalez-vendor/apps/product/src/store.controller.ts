import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { VerifyStoreDto } from './dto/store.dto';

@Controller()
export class StoreController {
  constructor(private storeService: StoreService) {}

  @EventPattern('store.create')
  @UsePipes(new ValidationPipe())
  async createStore(
    @Payload() payload: { createStoreDto: CreateStoreDto; userId: string },
  ) {
    return this.storeService.createStore(
      payload.createStoreDto,
      payload.userId,
    );
  }

  @EventPattern('store.verify')
  @UsePipes(new ValidationPipe())
  async verifyStore(@Payload() verifyStoreDto: VerifyStoreDto) {
    return this.storeService.verifyStore(verifyStoreDto);
  }
}
