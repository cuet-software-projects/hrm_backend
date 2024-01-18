import { Router } from 'express';
import InvoiceController from './invoice.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { CreateInvoiceSchema, UpdateInvoiceSchema } from './invoice.schema';
import { invoiceService } from '../core/dependecies';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { invoiceQueryParams } from './invoice.query-params';
import InvoiceMiddleware from './invoice-middleware';

const invoiceRouter = Router();

const invoiceController = new InvoiceController(invoiceService);

//Get all the invoices
invoiceRouter.get('/all', invoiceController.getAllInvoices);

//paginated of invoices get
invoiceRouter.get(
  '',
  validateQueryParams(invoiceQueryParams),
  invoiceController.getInvoices,
);

// Get a single invoice details
invoiceRouter.get(
  '/:invoice_id',
  ValidateIdMiddleware.validateParamsId,
  invoiceController.getInvoice,
);

// Create a new invoice
invoiceRouter.post(
  '/',
  validate(CreateInvoiceSchema),
  ValidateIdMiddleware.validateBodyId,
  invoiceController.createInvoice,
);

// Update an invoice
invoiceRouter.patch(
  '/:invoice_id',
  validate(UpdateInvoiceSchema),
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  InvoiceMiddleware.checkAmountPaid,
  invoiceController.updateInvoice,
);

export default invoiceRouter;
