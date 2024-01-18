import { INVOICE_TAX_PERCENTAGE } from '../constants';
import InvoiceRepository from './invoice.repository';
import {
  IInvoice,
  INVOICE_DISCOUNT_TYPE,
  InvoiceDto,
  InvoiceItemDto,
  PaginateResponse,
  PaginationQueryParams,
  UpdateInvoiceDto,
} from '../core/types';

export default class InvoiceService {
  constructor(protected readonly invoiceRepo: InvoiceRepository) {}

  public async getInvoices(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<IInvoice>> {
    return await this.invoiceRepo.getInvoices(params);
  }

  public async getAllInvoices() {
    const allInvoices = await this.invoiceRepo.getAllInvoices();
    return allInvoices;
  }

  public async getInvoice(invoice_id: string) {
    const invoice = await this.invoiceRepo.getInvoice(invoice_id);
    return invoice;
  }

  private calculateInvoiceAttribute(
    invoice_items: InvoiceItemDto[],
    discount: number,
    discount_type: INVOICE_DISCOUNT_TYPE,
    tax_percentage: number,
  ) {
    let sub_total = invoice_items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    let discountedAmount = 0;

    if (discount && discount_type) {
      discountedAmount =
        discount_type === 'PERCENTAGE' ? (sub_total * discount) / 100 : discount;
    }

    const total = sub_total - discountedAmount + (sub_total * tax_percentage) / 100;
    return {
      sub_total,
      total,
    };
  }

  public async createInvoice(payload: InvoiceDto) {
    const { sub_total, total } = this.calculateInvoiceAttribute(
      payload.invoice_items,
      payload.discount ?? 0,
      payload.discount_type,
      payload.tax_percentage ?? INVOICE_TAX_PERCENTAGE,
    );

    const newInvoice = await this.invoiceRepo.createInvoice({
      ...payload,
      tax_percentage: payload.tax_percentage ?? INVOICE_TAX_PERCENTAGE,
      status: payload.status ?? 'DRAFT',
      discount: payload.discount ?? 0,
      sub_total,
      total,
    });

    return newInvoice;
  }

  public async updateInvoice(invoice_id: string, payload: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.getInvoice(invoice_id);

    const invoiceItemsDetails = {
      discount:
        payload.discount !== undefined && payload.discount !== null
          ? payload.discount
          : invoice.discount,
      tax_percentage:
        payload.tax_percentage !== undefined && payload.tax_percentage !== null
          ? payload.tax_percentage
          : invoice.tax_percentage,
    };

    const { sub_total, total } = this.calculateInvoiceAttribute(
      payload.invoice_items ?? invoice.invoice_items,
      payload.discount,
      payload.discount_type,
      invoiceItemsDetails.tax_percentage,
    );

    const updatedInvoice = await this.invoiceRepo.updateInvoice(invoice_id, {
      ...payload,
      sub_total,
      total,
    });

    return updatedInvoice;
  }
}
