import { Request as ExpressRequest } from 'express';
import { IUser } from '../../users/user.type';
import {
  BONUS_VALUES,
  PAYROLL_VALUES,
  USER_GENDER,
  USER_MARITAL_STATUS,
  RELIGION,
  TSHIRT,
  WORK_TYPE,
  BRANCH_CODE,
  EMPLOYEE_PROMOTION_REASON_VALUES,
  USER_CURRENT_STATUS_VALUES,
  LEAVE_TYPE_VALUES,
  LEAVE_STATUS_VALUE,
  DOCUMENT_ASSOCIATIONS_VALUES,
  FEEDBACK_TYPE_VALUES,
  SALARY_CERTIFICATE_STATUS_VALUES,
  INVOICE_STATUS_VALUES,
  NOTICE_TYPE_VALUES,
  INVOICE_DISCOUNT_TYPE_VALUES,
} from './values';
export * from '../../documents/document.type';
export * from './values';
export * from '../../departments/department.type';
export * from '../../roles/role.type';
export * from '../../user-roles/user-role.type';
export * from '../../teams/team.type';
export * from '../../branches/branch.type';
export * from '../../users/user.type';
export * from '../../designations/designation.type';
export * from '../../attendances/attendance.type';
export * from '../../auth/auth.type';
export * from '../../payrolls/payroll.type';
export * from '../../leaves/leave.type';
export * from '../../invoices/invoice.type';
export * from '../../billing-info/billing-info.type';

export type USER_GENDER_TYPE = (typeof USER_GENDER)[number];

export type USER_MARITAL_STATUS_TYPE = (typeof USER_MARITAL_STATUS)[number];

export type RELIGION_TYPE = (typeof RELIGION)[number];

export type USER_CURRENT_STATUS_TYPE = (typeof USER_CURRENT_STATUS_VALUES)[number];

export type PAYROLL_TYPE = (typeof PAYROLL_VALUES)[number];

export type LEAVE_TYPE = (typeof LEAVE_TYPE_VALUES)[number];
export type LEAVE_STATUS_TYPE = (typeof LEAVE_STATUS_VALUE)[number];

export type BONUS_TYPE = (typeof BONUS_VALUES)[number];

export type TSHIRT_TYPE = (typeof TSHIRT)[number];

export type EMPLOYEE_WORK_TYPE = (typeof WORK_TYPE)[number];

export type BRANCH_CODE_TYPE = (typeof BRANCH_CODE)[number];

export type DOCUMENT_ASSOCIATION_TYPE = (typeof DOCUMENT_ASSOCIATIONS_VALUES)[number];

export type EMPLOYEE_PROMOTION_REASON_TYPE =
  (typeof EMPLOYEE_PROMOTION_REASON_VALUES)[number];

export type FEEDBACK_TYPE = (typeof FEEDBACK_TYPE_VALUES)[number];

export type INVOICE_STATUS_TYPE = (typeof INVOICE_STATUS_VALUES)[number];
export type INVOICE_DISCOUNT_TYPE = (typeof INVOICE_DISCOUNT_TYPE_VALUES)[number];

export type SALARY_CERTIFICATE_STATUS_TYPE =
  (typeof SALARY_CERTIFICATE_STATUS_VALUES)[number];

export interface Request extends ExpressRequest {
  user: IUser;
}

export type NOTICE_TYPE = (typeof NOTICE_TYPE_VALUES)[number];

export interface PaginateResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export type PaginationQueryParams = {
  filters?: Record<string, any>;
  fields?: string;
  sorts?: string;
  search?: string;
  includes?: string;
  page?: number;
  limit?: number;
};
