import { Router } from 'express';
import AttendanceController from './attendance.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { attendanceQueryParams } from '../queryparams';
import {
  CreateAttendanceSchema,
  GetSingleAttendanceSchema,
  UpdateAttendanceMarkingsSchema,
  UpdateAttendanceSchema,
} from './attendances.schema';
import { attendanceService } from '../core/dependecies';
import { AttendanceDateSchema } from '../core/types';
const attendanceRouter = Router();

const attendanceController = new AttendanceController(attendanceService);

// Get all
attendanceRouter.get('/attendances/all', attendanceController.getAllAttendances);

// Get with pagination
attendanceRouter.get(
  '/attendances',
  validateQueryParams(attendanceQueryParams),
  attendanceController.getAttendances,
);

// get employees attendances
attendanceRouter.get(
  '/:employeeInfoId/attendances',
  ValidateIdMiddleware.validateParamsId,
  attendanceController.getEmployeeAttendances,
);

// Get a attendance
attendanceRouter.get(
  '/attendances/:attendance_id',
  validate(GetSingleAttendanceSchema),
  ValidateIdMiddleware.validateParamsId,
  attendanceController.getAttendance,
);

// Create a attendance
attendanceRouter.post(
  '/attendance',
  validate(CreateAttendanceSchema),
  ValidateIdMiddleware.validateBodyId,
  attendanceController.createAttendance,
);

// Update attendance
attendanceRouter.patch(
  '/attendances/:attendance_id',
  validate(UpdateAttendanceSchema),
  ValidateIdMiddleware.validateParamsId,
  attendanceController.updateAttendance,
);

// Update markings
attendanceRouter.put(
  '/attendances/markings/:attendance_id',
  validate(UpdateAttendanceMarkingsSchema),
  ValidateIdMiddleware.validateParamsId,
  attendanceController.updateMarkings,
);

// This function is to get the attendance overview on the desired date
attendanceRouter.get(
  '/attendances/:date/attendance-overview',
  validate(AttendanceDateSchema),
  attendanceController.getAttendanceOverview,
);

export default attendanceRouter;
