import { Billing_Info, User } from '@prisma/client';
import { IUser } from '../users/user.type';

export type BillingInfoDto = {
  user_id: string;
  address_line_1: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
};

export interface IBillingInfo {
  id: string;
  user_id: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  user?: IUser;
}

export type PrismaBillingInfoModel = Billing_Info & {
  user?: User;
};

export type UpdateBillingInfoDto = Partial<BillingInfoDto>;
