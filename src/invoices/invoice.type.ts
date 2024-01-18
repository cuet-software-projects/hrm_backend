import { Invoice, User } from '@prisma/client';
import { INVOICE_DISCOUNT_TYPE, INVOICE_STATUS_TYPE, IUser } from '../core/types';

export type InvoiceDto = {
  issue_date: string;
  invoice_subject: string;
  invoice_items: InvoiceItemDto[];
  tax_percentage?: number;
  discount?: number;
  discount_type?: INVOICE_DISCOUNT_TYPE;
  note?: string;
  status?: INVOICE_STATUS_TYPE;
  user_id: string;
  invoice_id: string;
  due_date: string;
  parent_invoice_id?: string;
  received_by_id?: string;
  amount_paid?: number;
};

export type InvoiceItemDto = {
  name: string;
  price: number;
  quantity: number;
};

export interface IInvoice {
  issue_date: string;
  id: string;
  invoice_subject: string;
  invoice_items?: InvoiceItemDto[];
  sub_total: number;
  tax_percentage: number;
  discount?: number;
  discount_type?: INVOICE_DISCOUNT_TYPE;
  total: number;
  note?: string;
  status: INVOICE_STATUS_TYPE;
  user_id: string;
  user?: IUser;
  due_date: string;
  parent_invoice_id: string;
  received_by_id: string;
  amount_paid: number;
  child_invoices?: IInvoice[];
  received_by?: IUser;
  parent_invoice?: IInvoice;
}

export type PrismaInvoiceModel = Invoice & {
  user?: User;
  received_by?: User;
  parent_invoice?: Invoice;
  child_invoices?: Invoice[];
};

export type UpdateInvoiceDto = Partial<InvoiceDto>;
