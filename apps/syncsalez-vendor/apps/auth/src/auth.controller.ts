import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @EventPattern('auth.login')
  @UsePipes(new ValidationPipe())
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @EventPattern('auth.register')
  @UsePipes(new ValidationPipe())
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
