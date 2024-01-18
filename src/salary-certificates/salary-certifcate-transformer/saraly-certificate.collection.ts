import {
  ISalaryCertificate,
  PrismaSalaryCertificateModel,
} from '../salary-certificate.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import salaryCertificateResource from './salary-certificate.resource';

class SalaryCertificateCollection implements CollectionTransformer {
  transformCollection(
    requestedData: PrismaSalaryCertificateModel[],
  ): ISalaryCertificate[] {
    return requestedData.map((role) => salaryCertificateResource.transform(role));
  }
}

const salaryCertificateCollection = new SalaryCertificateCollection();
export default salaryCertificateCollection;
