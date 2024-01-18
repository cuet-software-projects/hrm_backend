import dayjs from 'dayjs';
import { Transformer } from '../../core/transformer/transformer';
import { IInvoice, PrismaInvoiceModel } from '../../core/types';
import userResource from '../../users/user-transformer/user.resource';
import invoiceCollection from './invoice.collection';

class InvoiceResource implements Transformer {
  transform(invoice: PrismaInvoiceModel): IInvoice {
    return {
      id: invoice?.id,
      invoice_subject: invoice?.invoice_subject,
      sub_total: invoice?.sub_total,
      tax_percentage: invoice?.tax_percentage,
      invoice_items: JSON.parse(JSON.stringify(invoice.invoice_items))?.map(
        (item) =>
          ({
            ...item,
            quantity: item.quantity,
            price: item.price,
          }) ?? [],
      ),
      discount: invoice.discount,
      discount_type: invoice.discount_type,
      total: invoice.total,
      note: invoice.note,
      user_id: invoice.user_id,
      issue_date: dayjs(invoice.issue_date).toISOString(),
      due_date: dayjs(invoice.due_date).toISOString(),
      amount_paid: invoice.amount_paid,
      parent_invoice_id: invoice.parent_invoice_id,
      received_by_id: invoice.received_by_id,
      status: invoice.status,
      user: invoice?.user ? userResource.transform(invoice.user) : null,
      received_by: invoice?.received_by
        ? userResource.transform(invoice.received_by)
        : null,
      parent_invoice: invoice?.parent_invoice
        ? this.transform(invoice.parent_invoice)
        : null,
      child_invoices: invoice.child_invoices
        ? invoiceCollection.transformCollection(invoice.child_invoices)
        : null,
    };
  }
}

const invoiceResource = new InvoiceResource();

export default invoiceResource;
