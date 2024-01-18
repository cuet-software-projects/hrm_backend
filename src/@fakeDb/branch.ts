import { faker } from '@faker-js/faker';

export const createBranchFakeData = () => {
  return {
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  };
};
export const createBranchFakeList = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  }));
};
