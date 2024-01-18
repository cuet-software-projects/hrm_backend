import { IBillingInfo, PrismaBillingInfoModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import billingInfoResource from './billing-info.transformer';

class BillingInfoCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaBillingInfoModel[]): IBillingInfo[] {
    return requestedData.map((billingInfo: PrismaBillingInfoModel) =>
      billingInfoResource.transform(billingInfo),
    );
  }
}

const billingInfoCollection = new BillingInfoCollection();

export default billingInfoCollection;
