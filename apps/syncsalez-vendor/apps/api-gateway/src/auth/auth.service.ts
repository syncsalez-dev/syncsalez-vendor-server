import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto, RegisterDto, UserDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const response = this.natsClient.send('auth.login', loginDto);
    return lastValueFrom(response);
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const response = this.natsClient.send('auth.register', registerDto);
    return lastValueFrom(response);
  }
}
