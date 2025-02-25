// apps/auth/auth.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('auth')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get()
  getHello(): string {
    return this.storeService.getHello();
  }
}
