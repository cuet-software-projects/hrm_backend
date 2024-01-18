import { Request, Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import SalaryCertificateService from './salary.certificate.service';
import { SALARY_CERTIFICATE_STATUS_TYPE } from '../core/types';
import { SalaryCertificateDTO } from './salary-certificate.type';
import catchAsync from '../utils/catchAsync';
export default class SalaryCertificateController {
  constructor(protected readonly salaryCertificateService: SalaryCertificateService) {}

  public createSalaryCertificate = catchAsync(async (req: Request, res: Response) => {
    const requestDTO = req.body as SalaryCertificateDTO;
    const { user_id } = req.params;
    const data = await this.salaryCertificateService.createSalaryCertificate({
      user_id: user_id,
      data: requestDTO,
    });
    apiResponse.sendSuccess({
      res,
      code: 201,
      data,
    });
  });

  public updateSalaryCertificateStatus = catchAsync(
    async (req: Request, res: Response) => {
      const { status } = req.body;
      const { salary_certificate_id } = req.params;
      const data = await this.salaryCertificateService.updateSalaryCertificateStatus({
        status: status as SALARY_CERTIFICATE_STATUS_TYPE,
        salary_certificate_id: salary_certificate_id,
      });
      apiResponse.sendSuccess({
        res,
        code: 204,
        data: data,
      });
    },
  );

  public getUserLastApprovedSalaryCertificate = catchAsync(
    async (req: Request, res: Response) => {
      const { user_id } = req.params;
      const data =
        await this.salaryCertificateService.getUserLastApprovedSalaryCertificate(user_id);
      apiResponse.sendSuccess({
        res,
        code: 200,
        data: data,
      });
    },
  );

  public getSalaryCertificates = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, includes, filters, search, sorts } = req.query;
    const data = await this.salaryCertificateService.getSalaryCertificates({
      page: Number(page),
      limit: Number(limit),
      filters: filters as Record<string, any>,
      includes: includes as string,
      search: search as string,
      sorts: sorts as string,
    });
    apiResponse.sendSuccess({
      res,
      code: 200,
      data: data.data,
      meta: data.meta,
    });
  });
}
