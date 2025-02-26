import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [AuthModule, StoreModule],
})
export class AppModule {}
