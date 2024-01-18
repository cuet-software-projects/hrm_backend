import { Router } from 'express';
import BonusController from './bonus.controller';
import BonusMiddleware from './bonus.middleware';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { bonusQueryParams } from './bonus.queryparams';
import { bonusService } from '../core/dependecies';
import validate from '../core/middlewares/validate';
import { BonusSchema, UpdateBonusSchema } from './bonus.schema';
const bonusRoute = Router();

const bonusController = new BonusController(bonusService);

bonusRoute.post(
  '/:employeeInfoId/bonus',
  validate(BonusSchema),
  ValidateIdMiddleware.validateParamsId,
  bonusController.createBonus,
);

bonusRoute.get(
  '/:employeeInfoId/bonuses',
  validateQueryParams(bonusQueryParams),
  bonusController.getBonusesOfEmployee,
);
bonusRoute.get('/bonuses', bonusController.getAllBonuses);
bonusRoute.put(
  '/bonuses/:bonusId',
  validate(UpdateBonusSchema),
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  // BonusMiddleware.checkStatus,
  bonusController.updateBonus,
);
export default bonusRoute;
