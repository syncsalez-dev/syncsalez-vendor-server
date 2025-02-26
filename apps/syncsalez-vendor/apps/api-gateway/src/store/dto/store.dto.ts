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
}

export class StoreDto {
  id: string;
  businessName: string;
  businessType: string;
  phoneNumber?: string;
  businessEmail: string;
  businessLocation?: string;
  logo?: string;
  isVerified: boolean;
  createdAt: Date;
}
