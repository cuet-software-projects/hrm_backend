import dayjs from 'dayjs';
import { DbType, db } from '../db.server';
import salaryCertificateResource from './salary-certifcate-transformer/salary-certificate.resource';
import {
  IUser,
  PaginateResponse,
  PaginationQueryParams,
  SALARY_CERTIFICATE_STATUS_TYPE,
} from '../core/types';
import {
  ISalaryCertificate,
  PrismaSalaryCertificateModel,
  SalaryCertificateDTO,
} from './salary-certificate.type';
import BaseRepository from '../core/repository/base.repository';
import salaryCertificateCollection from './salary-certifcate-transformer/saraly-certificate.collection';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
export default class SalaryCertificateRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Salary_Certificate');
  }

  public async getSalaryCertificates({
    page = 1,
    limit = 10,
    filters,
    includes,
    search,
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<ISalaryCertificate>> {
    try {
      return await this.paginate<ISalaryCertificate, PrismaSalaryCertificateModel>({
        page,
        pageSize: limit,
        transformCollection: salaryCertificateCollection.transformCollection,
        options: {
          where: buildWhereObject(filters),
          orderBy: buildSortObject(sorts),
          includes: buildIncludesObject(includes?.split(',') ?? []),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async createSalaryCertificate({
    user,
    data,
  }: {
    user: IUser;
    data: SalaryCertificateDTO;
  }): Promise<ISalaryCertificate> {
    try {
      return await this.create<ISalaryCertificate, PrismaSalaryCertificateModel>(
        {
          user_id: user.id,
          reason: data.reason,
          issue_date: dayjs(data.issue_date).toDate(),
          current_salary: user.current_employment_info.current_salary,
          current_designation:
            user.current_employment_info.current_employee_designation.name,
        },
        salaryCertificateResource.transform,
      );
    } catch (error) {
      throw error;
    }
  }

  public async updateSalaryCertificateStatus({
    status,
    salary_certificate_id,
  }: {
    status: SALARY_CERTIFICATE_STATUS_TYPE;
    salary_certificate_id: string;
  }): Promise<ISalaryCertificate> {
    try {
      return await this.update<ISalaryCertificate, PrismaSalaryCertificateModel>(
        salary_certificate_id,
        { status: status },
        salaryCertificateResource.transform,
      );
    } catch (error) {
      throw error;
    }
  }

  public async getUserLastApprovedSalaryCertificate(
    user_id: string,
  ): Promise<ISalaryCertificate | null> {
    try {
      const data = await db.salary_Certificate.findFirst({
        where: {
          user_id: user_id,
          status: 'APPROVED',
        },
        orderBy: {
          issue_date: 'desc',
        },
      });
      return data ? salaryCertificateResource.transform(data) : null;
    } catch (error) {
      throw error;
    }
  }
}
