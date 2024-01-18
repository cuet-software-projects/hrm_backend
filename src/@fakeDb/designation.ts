import { faker } from '@faker-js/faker';

export const createDesignationFakeData = () => {
  return {
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  };
};

export const createDesignationFakeList = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.uuid(),
    name: faker.hacker.noun(),
  }));
};
