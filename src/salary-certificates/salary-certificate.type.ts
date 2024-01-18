import { Salary_Certificate } from '@prisma/client';
import { IUser, PrismaUserModel } from '../users/user.type';
import { SALARY_CERTIFICATE_STATUS_TYPE } from '../core/types';

export type ISalaryCertificate = {
  id: string;
  created_at?: string;
  updated_at?: string;
  reason: string;
  issue_date: string;
  user_id: string;
  user: IUser;
  status?: SALARY_CERTIFICATE_STATUS_TYPE;
  current_salary: number;
  current_designation: string;
};

export type SalaryCertificateDTO = {
  reason: string;
  issue_date: string;
};

export type UpdateSalaryCertificateDTO = {
  status: SALARY_CERTIFICATE_STATUS_TYPE;
};

export type PrismaSalaryCertificateModel = Salary_Certificate & {
  user?: PrismaUserModel;
};
