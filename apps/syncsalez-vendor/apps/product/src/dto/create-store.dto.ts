import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum BusinessType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}

export class CreateStoreDto {
  @IsString()
  businessName: string;

  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  @IsOptional()
  businessLocation?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  userId: string; // ID of the user creating the store (from auth-service)
}
