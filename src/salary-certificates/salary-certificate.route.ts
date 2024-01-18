import { Router } from 'express';
import SalaryCertificateController from './salary-certificate.controller';
import validate from '../core/middlewares/validate';
import {
  SalaryCertificateSchema,
  UpdateSalaryCertificateStatusSchema,
} from './salary-certificate.schema';
import { salaryCertificateService } from '../core/dependecies';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { salaryCertificateQueryParams } from './salary-certificate.query-params';
const salaryCertificateRouter = Router();

const serviceController = new SalaryCertificateController(salaryCertificateService);

salaryCertificateRouter.get(
  '',
  validateQueryParams(salaryCertificateQueryParams),
  serviceController.getSalaryCertificates,
);

salaryCertificateRouter.post(
  '/:user_id',
  validate(SalaryCertificateSchema),
  serviceController.createSalaryCertificate,
);

salaryCertificateRouter.patch(
  '/:salary_certificate_id/status',
  validate(UpdateSalaryCertificateStatusSchema),
  ValidateIdMiddleware.validateParamsId,
  serviceController.updateSalaryCertificateStatus,
);

salaryCertificateRouter.get(
  '/:user_id/last-approved',
  serviceController.getUserLastApprovedSalaryCertificate,
);
export default salaryCertificateRouter;
