import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { RELIGION, TSHIRT, USER_GENDER } from '../core/types';
export const createUserFakeData = () => {
  return {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    dob: dayjs(faker.date.birthdate()).format('YYYY-MM-DD'),
    fathers_name: faker.person.firstName() + ' ' + faker.person.lastName(),
    mothers_name: faker.person.firstName() + ' ' + faker.person.lastName(),
    blood_group: faker.helpers.arrayElement([
      'A+',
      'A-',
      'B+',
      'B-',
      'O+',
      'O-',
      'AB+',
      'AB-',
    ]),
    contact_number: faker.phone.number(),
    emergency_contact_number: faker.phone.number(),
    nid: faker.string.uuid(),
    permanent_address: faker.location.streetAddress(),
    password: faker.internet.password(),
    present_address: faker.location.streetAddress(),
    tshirt: faker.helpers.arrayElement(TSHIRT),
    tin_number: faker.string.uuid(),
    gender: faker.helpers.arrayElement(USER_GENDER),
    religion: faker.helpers.arrayElement(RELIGION),
  };
};

export const createUserFakeDataWithEmployeeInfo = () => {
  const userFakeData = createUserFakeData();
  return Array.from({ length: 20 }, () => {
    return {
      ...userFakeData,
    };
  });
};
export const createUserFakeListWithoutEmployeeInfo = () => {
  return Array.from({ length: 20 }, () => ({
    first_name: faker.person.firstName(),
    id: faker.string.uuid(),
    last_name: faker.person.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    dob: dayjs(faker.date.birthdate()).format('YYYY-MM-DD'),
    fathers_name: faker.person.firstName() + ' ' + faker.person.lastName(),
    mothers_name: faker.person.firstName() + ' ' + faker.person.lastName(),
    blood_group: faker.helpers.arrayElement([
      'A+',
      'A-',
      'B+',
      'B-',
      'O+',
      'O-',
      'AB+',
      'AB-',
    ]),
    contact_number: faker.phone.number(),
    emergency_contact_number: faker.phone.number(),
    nid: faker.string.uuid(),
    permanent_address: faker.location.streetAddress(),
    password: faker.internet.password(),
    present_address: faker.location.streetAddress(),
    tshirt: faker.helpers.arrayElement(TSHIRT),
    tin_number: faker.string.uuid(),
    gender: faker.helpers.arrayElement(USER_GENDER),
    religion: faker.helpers.arrayElement(RELIGION),
  }));
};

export const userFakeDataWithEmployeeInfo = createUserFakeDataWithEmployeeInfo();
export const userFakeListWithoutEmployeeInfo = createUserFakeListWithoutEmployeeInfo();
export const createUserFakeList = () => {
  return [
    ...createUserFakeDataWithEmployeeInfo(),
    ...createUserFakeListWithoutEmployeeInfo(),
  ];
};
