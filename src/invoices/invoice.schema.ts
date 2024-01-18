import { z } from 'zod';
import { isValidDate, isValidIso, isValidUUID } from '../utils/utils';
import ApiError from '../utils/ApiError';
import { INVOICE_DISCOUNT_TYPE_VALUES, INVOICE_STATUS_VALUES } from '../core/types';

export const CreateInvoiceSchema = z.object({
  body: z
    .object({
      issue_date: z.string().refine(isValidIso, {
        message: 'Date format is not valid. Please use ISO format',
      }),
      due_date: z.string().refine(isValidIso, {
        message: 'Date format is not valid. Please use ISO format',
      }),
      invoice_subject: z.string(),
      invoice_items: z.array(
        z.object({
          name: z.string(),
          price: z.number(),
          quantity: z.number(),
        }),
      ),
      tax_percentage: z.number().optional(),
      discount_type: z.enum(INVOICE_DISCOUNT_TYPE_VALUES).optional(),
      discount: z.number().min(0, 'Discount can not be negative').optional(),
      note: z.string().optional(),
      status: z.enum(INVOICE_STATUS_VALUES).optional(),
      user_id: z.string().refine(isValidUUID, { message: 'Invalid UUID' }),
      invoice_id: z.string(),
      parent_invoice_id: z.string().optional(),
      received_by_id: z
        .string()
        .refine(isValidUUID, { message: 'Invalid UUID' })
        .optional(),
      amount_paid: z.number().optional(),
    })
    .refine((data) => {
      if (data.amount_paid !== undefined && data.amount_paid !== null) {
        if (data.amount_paid < 0) {
          throw new ApiError(400, 'Amount paid must be greater than 0');
        }
        if (!['PAID', 'PARTIALLY_PAID'].includes(data.status)) {
          throw new ApiError(
            400,
            'Status must be PAID or PARTIALLY_PAID if amount_paid is provided',
          );
        }
      }
      // Check whether the discount value is appropriate based on the discount type
      if (data.discount_type === 'PERCENTAGE') {
        if (data.discount > 100) {
          throw new ApiError(
            400,
            'Discount value can not be more than 100 when Discount type is percentage',
          );
        }
      }
      return true;
    }),
});

export const UpdateInvoiceSchema = z.object({
  body: z
    .object({
      issue_date: z
        .string()
        .refine(isValidIso, {
          message: 'Date format is not valid. Please use ISO format',
        })
        .optional(),
      due_date: z
        .string()
        .refine(isValidIso, {
          message: 'Date format is not valid. Please use ISO format',
        })
        .optional(),
      invoice_subject: z.string().optional(),
      invoice_items: z
        .array(
          z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
          }),
        )
        .optional(),
      tax_percentage: z.number().optional(),
      discount_type: z.enum(INVOICE_DISCOUNT_TYPE_VALUES).optional(),
      discount: z.number().min(0, 'Discount can not be negative').optional(),
      note: z.string().optional(),
      status: z.enum(INVOICE_STATUS_VALUES).optional(),
      user_id: z.string().refine(isValidUUID, { message: 'Invalid UUid' }).optional(),
      parent_invoice_id: z.string().optional(),
      received_by_id: z
        .string()
        .refine(isValidUUID, { message: 'Invalid UUid' })
        .optional(),
      amount_paid: z.number().optional(),
    })
    .refine((data) => {
      if (data.amount_paid !== undefined && data.amount_paid !== null) {
        if (data.amount_paid < 0) {
          throw new ApiError(400, 'Amount paid must be greater than 0');
        }
        if (!['PAID', 'PARTIALLY_PAID'].includes(data.status)) {
          throw new ApiError(
            400,
            'Status must be PAID or PARTIALLY_PAID if amount_paid is provided',
          );
        }
      }
      // Check whether the discount value is appropriate based on the discount type
      if (data.discount > 0 && !data.discount_type) {
        throw new ApiError(400, 'Discount Type must be provided with discount');
      }
      if (data.discount_type === 'PERCENTAGE') {
        if (data.discount > 100) {
          throw new ApiError(
            400,
            'Discount value can not be more than 100 when Discount type is percentage',
          );
        }
      }
      return true;
    }),
});
