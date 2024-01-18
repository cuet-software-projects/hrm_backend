import { Router } from 'express';
import BillingInfoController from './billing-info.controller';
import { billingInfoService } from '../core/dependecies';
import validate from '../core/middlewares/validate';
import { CreateBillingInfoSchema, UpdateBillingInfoSchema } from './billing-info.schema';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { billingInfoQueryParams } from './billing-info.query-params';

const billingInfoRouter = Router();

const billingInfoController = new BillingInfoController(billingInfoService);

//get paginated billing infos
billingInfoRouter.get(
  '/billing-infos',
  validateQueryParams(billingInfoQueryParams),
  billingInfoController.getBillingInfos,
);

//get user specific billing info
billingInfoRouter.get(
  '/users/:user_id/billing-info',
  ValidateIdMiddleware.validateParamsId,
  billingInfoController.getUserBillingInfo,
);

billingInfoRouter.post(
  '/billing-info',
  validate(CreateBillingInfoSchema),
  ValidateIdMiddleware.validateBodyId,
  billingInfoController.createBillingInfo,
);

billingInfoRouter.patch(
  '/billing-info/:billing_info_id',
  validate(UpdateBillingInfoSchema),
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  billingInfoController.updateBillingInfo,
);

export default billingInfoRouter;
