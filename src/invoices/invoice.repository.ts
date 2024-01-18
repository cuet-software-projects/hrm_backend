import { Invoice, Prisma } from '@prisma/client';
import { DbType, db } from '../db.server';
import invoiceCollection from './invoice-transformer/invoice.collection';
import invoiceResource from './invoice-transformer/invoice.transformer';
import {
  IInvoice,
  InvoiceDto,
  PaginateResponse,
  PaginationQueryParams,
  UpdateInvoiceDto,
} from '../core/types';
import BaseRepository from '../core/repository/base.repository';
import dayjs from 'dayjs';
import {
  buildIncludesObject,
  buildSearchQuery,
  buildSortObject,
  buildWhereObject,
} from '../utils/utils';

export default class InvoiceRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Invoice');
  }

  public async getInvoices({
    page,
    limit,
    filters,
    includes = '',
    search,
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<IInvoice>> {
    try {
      const includeArray = includes.split(',');

      const searchQuery = buildSearchQuery(search, ['id', 'invoice_subject']);

      const response = await this.paginate({
        page,
        pageSize: limit,
        transformCollection: invoiceCollection.transformCollection,
        options: {
          includes: buildIncludesObject(includeArray ?? []),
          where: { ...buildWhereObject(filters), ...searchQuery },
          orderBy: buildSortObject(sorts),
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getAllInvoices(): Promise<IInvoice[]> {
    try {
      const allInvoices = await this.getAll<IInvoice, Invoice>(
        invoiceCollection.transformCollection,
      );
      return allInvoices;
    } catch (error) {
      throw error;
    }
  }

  public async getInvoice(invoice_id: string) {
    try {
      const invoice = await this.db.invoice.findUnique({
        where: { id: invoice_id },
        include: {
          ...buildIncludesObject(['user.billing_info', 'received_by']),
        },
      });
      return invoiceResource.transform(invoice);
    } catch (error) {
      throw error;
    }
  }

  public async createInvoice(
    data: InvoiceDto & {
      sub_total: number;
      total: number;
    },
  ) {
    try {
      const newInvoice = await this.create<IInvoice, Invoice>(
        {
          invoice_subject: data.invoice_subject,
          issue_date: dayjs(data.issue_date).toDate(),
          invoice_items: data.invoice_items as Prisma.JsonArray,
          note: data.note,
          sub_total: data.sub_total,
          tax_percentage: data.tax_percentage,
          discount: data.discount,
          discount_type: data.discount_type,
          total: data.total,
          user_id: data.user_id,
          id: data.invoice_id,
          status: data.status,
          received_by_id: data.received_by_id,
          amount_paid: data.amount_paid,
          parent_invoice_id: data.parent_invoice_id,
          due_date: dayjs(data.due_date).toDate(),
        },
        invoiceResource.transform,
      );

      return newInvoice;
    } catch (error) {
      throw error;
    }
  }

  public async updateInvoice(
    invoice_id: string,
    data: UpdateInvoiceDto & {
      sub_total?: number;
      total?: number;
    },
  ) {
    try {
      const newInvoice = await this.db.invoice.update({
        where: { id: invoice_id },
        data: {
          ...(data.invoice_items && {
            invoice_items: data.invoice_items as Prisma.JsonArray,
          }),
          ...(data.issue_date && { issue_date: data.issue_date }),
          ...(data.invoice_subject && { invoice_subject: data.invoice_subject }),
          ...(data.sub_total && { sub_total: data.sub_total }),
          ...(data.discount !== undefined &&
            data.discount !== null && { discount: data.discount }),
          ...(data.discount_type !== undefined &&
            data.discount_type !== null && { discount_type: data.discount_type }),
          ...(data.total && { total: data.total }),
          ...(data.tax_percentage !== undefined &&
            data.tax_percentage !== null && { tax_percentage: data.tax_percentage }),
          ...(data.note && { note: data.note }),
          ...(data.user_id && { user_id: data.user_id }),
          ...(data.status && { status: data.status }),
          ...(data.received_by_id && { received_by_id: data.received_by_id }),
          ...(data.amount_paid && { amount_paid: data.amount_paid }),
          ...(data.parent_invoice_id && { parent_invoice_id: data.parent_invoice_id }),
          ...(data.due_date && { due_date: data.due_date }),
        },
      });
      return invoiceResource.transform(newInvoice);
    } catch (error) {
      throw error;
    }
  }
}
