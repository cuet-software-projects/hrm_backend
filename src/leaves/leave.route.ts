import { Router } from 'express';
import LeaveController from './leave.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import {
  CreateLeaveSchema,
  GetLeaveDetailsSchema,
  LeaveApprovalSchema,
  UpdateLeaveSchema,
} from './leave.schema';
import { leaveService } from '../core/dependecies';
import { LeaveDateSchema } from '../core/types';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { leaveQueryParams } from './leave.query-params';
const leaveRoute = Router();

const leaveController = new LeaveController(leaveService);

// Get Leave Details
leaveRoute.get(
  '/leaves/:leaveId',
  validate(GetLeaveDetailsSchema),
  ValidateIdMiddleware.validateParamsId,
  leaveController.getLeaveDetails,
);

// Get leaves of an specific Employee with pagination
leaveRoute.get(
  '/:employeeInfoId/leaves',
  ValidateIdMiddleware.validateParamsId,
  leaveController.getLeavesOfEmployee,
);

// Get Leaves paginated
leaveRoute.get(
  '/leaves',
  validateQueryParams(leaveQueryParams),
  leaveController.getLeaves,
);

// Create Leave
leaveRoute.post(
  '/:employeeInfoId/leave',
  validate(CreateLeaveSchema),
  ValidateIdMiddleware.validateParamsId,
  leaveController.createLeave,
);

// Update Leave( By Employee)
leaveRoute.patch(
  '/:employeeInfoId/leave/:leaveId',
  validate(UpdateLeaveSchema),
  ValidateIdMiddleware.validateParamsId,
  leaveController.updateLeave,
);

// Update Leave Status( By Admin/ Supervisor)
leaveRoute.patch(
  '/:approverEmployeeId/leave-approval/:leaveId',
  validate(LeaveApprovalSchema),
  ValidateIdMiddleware.validateParamsId,
  leaveController.leaveApproval,
);

// leave overview
leaveRoute.get(
  '/:employeeInfoId/leave-overview',
  ValidateIdMiddleware.validateParamsId,
  leaveController.leaveOverviewOfEmployee,
);

// Get the employees in leave today
leaveRoute.get(
  '/:date/in-leave',
  validate(LeaveDateSchema),
  leaveController.getEmployeesInLeave,
);

export default leaveRoute;
