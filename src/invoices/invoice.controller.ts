import { Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import { InvoiceDto, Request, UpdateInvoiceDto } from '../core/types';
import catchAsync from '../utils/catchAsync';
import InvoiceService from './invoice.service';

export default class InvoiceController {
  constructor(protected readonly invoiceService: InvoiceService) {}

  public createInvoice = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as InvoiceDto;
    const newInvoice = await this.invoiceService.createInvoice(payload);
    apiResponse.sendSuccess({ res: res, data: newInvoice, code: 201 });
  });

  public getInvoices = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, search, sorts } = req.query;
    const { data, meta } = await this.invoiceService.getInvoices({
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      filters: filters as Record<string, any>,
      includes: includes as string,
      search: search as string,
      sorts: sorts as string,
    });
    apiResponse.sendSuccess({ res, data, code: 200, meta });
  });

  public getAllInvoices = catchAsync(async (req: Request, res: Response) => {
    const allInvoices = await this.invoiceService.getAllInvoices();
    apiResponse.sendSuccess({ res, data: allInvoices, code: 200 });
  });

  public getInvoice = catchAsync(async (req: Request, res: Response) => {
    const { invoice_id } = req.params;
    const invoice = await this.invoiceService.getInvoice(invoice_id);
    apiResponse.sendSuccess({ res, data: invoice, code: 200 });
  });

  public updateInvoice = catchAsync(async (req: Request, res: Response) => {
    const { invoice_id } = req.params;
    const payload = req.body as UpdateInvoiceDto;
    const newInvoice = await this.invoiceService.updateInvoice(invoice_id, payload);
    apiResponse.sendSuccess({ res, data: newInvoice, code: 204 });
  });
}
