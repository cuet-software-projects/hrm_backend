import { Router } from 'express';
import EmployeeController from './employee.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { CreateEmployeeSchemaType, UpdateEmployeeSchemaType } from './employee.schema';
import { employeeService } from '../core/dependecies';
const employeeRouter = Router();

const employeeController = new EmployeeController(employeeService);

// Get all users
employeeRouter.get('/employees/all', employeeController.getAllEmployeeInfos);

// Get  users paginated

// Get a user
employeeRouter.get(
  '/employees/:employeeInfoId',
  ValidateIdMiddleware.validateParamsId,
  employeeController.getEmployeeDetails,
);
// Create a user
employeeRouter.post(
  '/employee',
  validate(CreateEmployeeSchemaType),
  ValidateIdMiddleware.validateBodyId,
  employeeController.createEmployee,
);

// Delete a user

// Update a user
employeeRouter.patch(
  '/employees/:employeeInfoId',
  validate(UpdateEmployeeSchemaType),
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  employeeController.updateEmployee,
);

// get employees designation and salaries history
employeeRouter.get(
  '/employees/:employeeInfoId/designation-salary/history',
  ValidateIdMiddleware.validateParamsId,
  employeeController.getEmployeeDesignationSalaries,
);

export default employeeRouter;
