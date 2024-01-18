import SalaryCertificateRepository from './salary-certificate.repository';
import UserRepository from '../users/user.repository';
import { PaginationQueryParams, SALARY_CERTIFICATE_STATUS_TYPE } from '../core/types';
import { SalaryCertificateDTO } from './salary-certificate.type';

export default class SalaryCertificateService {
  constructor(
    protected readonly salaryCertificateRepo: SalaryCertificateRepository,
    protected readonly userRepo: UserRepository,
  ) {}

  public async createSalaryCertificate({
    user_id,
    data,
  }: {
    user_id: string;
    data: SalaryCertificateDTO;
  }) {
    try {
      const user = await this.userRepo.getUserDetails(user_id);
      const newSalaryCertificate =
        await this.salaryCertificateRepo.createSalaryCertificate({
          user,
          data,
        });

      return newSalaryCertificate;
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
  }) {
    try {
      const updatedSalaryCertificate =
        await this.salaryCertificateRepo.updateSalaryCertificateStatus({
          status,
          salary_certificate_id,
        });

      return updatedSalaryCertificate;
    } catch (error) {
      throw error;
    }
  }

  public async getSalaryCertificates(params: PaginationQueryParams) {
    try {
      return await this.salaryCertificateRepo.getSalaryCertificates(params);
    } catch (error) {
      throw error;
    }
  }

  public async getUserLastApprovedSalaryCertificate(user_id: string) {
    try {
      const user = await this.userRepo.getUserDetails(user_id);
      let previousSalaryCertificate = null;
      const salaryCertificate =
        await this.salaryCertificateRepo.getUserLastApprovedSalaryCertificate(user.id);
      if (!salaryCertificate) {
        previousSalaryCertificate = {
          user_id: user.id,
          current_salary: user?.current_employment_info?.current_salary,
          current_designation:
            user.current_employment_info?.current_employee_designation?.name,
        };
      } else {
        previousSalaryCertificate = salaryCertificate;
      }
      return previousSalaryCertificate;
    } catch (error) {
      throw error;
    }
  }
}
