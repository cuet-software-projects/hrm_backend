import { IInvoice, PrismaInvoiceModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import invoiceResource from './invoice.transformer';

class InvoiceCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaInvoiceModel[]): IInvoice[] {
    return requestedData.map((invoice) => invoiceResource.transform(invoice));
  }
}

const invoiceCollection = new InvoiceCollection();

export default invoiceCollection;
