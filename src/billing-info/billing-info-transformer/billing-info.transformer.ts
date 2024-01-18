import { Billing_Info, Prisma } from '@prisma/client';
import { Transformer } from '../../core/transformer/transformer';
import { IBillingInfo, PrismaBillingInfoModel } from '../../core/types';
import userResource from '../../users/user-transformer/user.resource';
import dayjs from 'dayjs';

class BillingInfoResource implements Transformer {
  transform(billingInfo: PrismaBillingInfoModel): IBillingInfo {
    return {
      id: billingInfo?.id,
      user_id: billingInfo?.user_id,
      user: billingInfo?.user ? userResource.transform(billingInfo.user) : null,
      address_line_1: billingInfo?.address_line_1,
      address_line_2: billingInfo?.address_line_2,
      city: billingInfo?.city,
      state: billingInfo?.state,
      country: billingInfo?.country,
      zip_code: billingInfo?.zip_code,
    };
  }
}

const billingInfoResource = new BillingInfoResource();

export default billingInfoResource;
