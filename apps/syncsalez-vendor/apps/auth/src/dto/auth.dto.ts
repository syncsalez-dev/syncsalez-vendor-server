import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UserDto {
  id: any;
  email: string;
  name: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phonenumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}
