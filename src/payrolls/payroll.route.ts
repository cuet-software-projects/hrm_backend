import { Router } from 'express';
import PayrollController from './payroll.controller';
import PayrollMiddleware from './payroll.middlewares';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { payrollQueryParams } from './payroll.queryparams';
import {
  CreatePayrollSchema,
  PayrollDateSchema,
  UpdatePayrollSchema,
} from './payroll.schema';
const payrollRoute = Router();

import { payrollService } from '../core/dependecies';
const payrollController = new PayrollController(payrollService);
payrollRoute.post(
  '/:employeeInfoId/payroll',
  validate(CreatePayrollSchema),
  ValidateIdMiddleware.validateParamsId,
  payrollController.createPayroll,
);

payrollRoute.get(
  '/:employeeInfoId/payrolls',
  validateQueryParams(payrollQueryParams),
  ValidateIdMiddleware.validateParamsId,
  payrollController.getPayrollsOfEmployee,
);

payrollRoute.get('/payrolls', payrollController.getAllPayrolls);

payrollRoute.put(
  '/payrolls/:payrollId',
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  validate(UpdatePayrollSchema),
  // PayrollMiddleware.checkStatus,
  payrollController.updatePayroll,
);

// The route will give the payroll overview for admin
payrollRoute.get(
  '/payrolls/:date/payroll-overview',
  validate(PayrollDateSchema),
  payrollController.getPayrollOverviewForAdmin,
);

// The route will give the payroll overview for an employee
payrollRoute.get(
  '/:employeeId/payrolls/:date/payroll-overview',
  ValidateIdMiddleware.validateParamsId,
  validate(PayrollDateSchema),
  payrollController.getPayrollOverviewForEmployee,
);

export default payrollRoute;
