import { Controller, Req, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/store.dto';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post('create-store') // Changed to /stores (remove 'create-store' if testing /stores)
  @UseGuards(JwtAuthGuard)
  async createStore(@Body() createStoreDto: CreateStoreDto, @Req() req: any) {
    return this.storeService.createStore(createStoreDto, req.user.userId);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  async verifyStore(@Param('id') storeId: string) {
    return this.storeService.verifyStore(storeId);
  }
}
