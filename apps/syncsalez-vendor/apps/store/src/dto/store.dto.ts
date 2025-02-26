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

export class VerifyStoreDto {
  id: string; // Store ID to verify
}
