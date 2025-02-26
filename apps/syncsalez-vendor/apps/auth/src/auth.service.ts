import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from 'src/dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new Error('Invalid credentials');
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          phonenumber: registerDto.phonenumber,
          password: hashedPassword,
        },
      });
      return {
        name: user.name,
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Registration failed due to an unexpected error',
        error.message,
      );
    }
  }
}
