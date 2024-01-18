import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import {
  createEmployeeFakeData,
  createEmployeeFakeList,
  createUserFakeList,
} from '../@fakeDb';
import { createBranchFakeList } from '../@fakeDb/branch';
import { createDepartmentFakeList } from '../@fakeDb/department';
import { createDesignationFakeList } from '../@fakeDb/designation';
import App from '../app';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { employeeService } from '../core/dependecies';
import { EMPLOYEE_PROMOTION_REASON_VALUES, WORK_TYPE } from '../core/types';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import EmployeeService from '../employee-info/employee.service';
const app = new App(5057).getApp();

const designationFakeList = createDesignationFakeList();
const departmentFakeList = createDepartmentFakeList();
const branchFakeList = createBranchFakeList();
const employeeFakeData = createEmployeeFakeData();
const employeeFakeList = createEmployeeFakeList();
const userFakeList = createUserFakeList();
const userFakeData = userFakeList[0];
const designationFakeData = designationFakeList[0];
const branchFakeData = branchFakeList[0];
const departmentFakeData = departmentFakeList[0];

jest.mock('../auth/auth', () => ({
  verifyToken: jest.fn((req, res, next) => {
    next();
  }),
}));
