import { faker } from '@faker-js/faker';

export const createDepartmentFakeData = () => {
  return {
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  };
};
export const createDepartmentFakeList = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  }));
};
