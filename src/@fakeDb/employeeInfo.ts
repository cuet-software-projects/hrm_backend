import { faker } from '@faker-js/faker';
import { EMPLOYEE_PROMOTION_REASON_VALUES, WORK_TYPE } from '../core/types';
import dayjs from 'dayjs';
import { createDesignationFakeData } from './designation';
import { createUserFakeData, createUserFakeList } from './user';
import { createDepartmentFakeData } from './department';
import { createBranchFakeData } from './branch';

const designationFakeData = createDesignationFakeData();
const branchFakeData = createBranchFakeData();
const departmentFakeData = createDepartmentFakeData();
const userFakeList = createUserFakeList();
export const createEmployeeFakeData = () => {
  const userFakeData = userFakeList[0];
  return {
    id: faker.string.uuid(),
    user_id: userFakeData.id,
    employee_id: faker.string.uuid(),
    department_id: departmentFakeData.id,
    branch_id: branchFakeData.id,
    joined_at: dayjs(new Date(2021, 9, 23)).format('YYYY-MM-DD'),
    isCurrent: true,
    created_at: dayjs().format('ddd, DD MMM YYYY HH:mm:ss [GMT]'),
    reporting_officer_id: userFakeData.id,
    work_type: faker.helpers.arrayElement(WORK_TYPE),
    designation_id: designationFakeData.id,
    salary: faker.number.int(),
    reason: faker.helpers.arrayElement(EMPLOYEE_PROMOTION_REASON_VALUES),
  };
};

export const createEmployeeFakeList = () => {
  return Array.from({ length: 20 }, () => {
    const designation = designationFakeData;
    const department = departmentFakeData;
    const branch = branchFakeData;
    const userFakeData = createUserFakeData();
    return {
      user_id: userFakeData.id,
      employee_id: faker.string.uuid(),
      department_id: department.id,
      branch_id: branch.id,
      joined_at: dayjs(new Date(2021, 9, 23)).format('YYYY-MM-DD'),
      isCurrent: true,
      created_at: dayjs().format('ddd, DD MMM YYYY HH:mm:ss [GMT]'),
      reporting_officer_id: userFakeData.id,
      work_type: faker.helpers.arrayElement(WORK_TYPE),
      designation_id: designation.id,
      salary: faker.number.int(),
      reason: faker.helpers.arrayElement(EMPLOYEE_PROMOTION_REASON_VALUES),
    };
  });
};
