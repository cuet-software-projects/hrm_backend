import { Employee_Info, User, User_Notification_Preference } from '@prisma/client';
import {
  BillingInfoDto,
  IBillingInfo,
  IRole,
  PrismaBillingInfoModel,
  PrismaUserRoleModel,
  RELIGION_TYPE,
  TSHIRT_TYPE,
  USER_CURRENT_STATUS_TYPE,
  USER_GENDER_TYPE,
  USER_MARITAL_STATUS_TYPE,
} from '../core/types';
import { IEmployee } from '../employee-info/employee.type';
import {
  IUserSocialMedia,
  PrismaUserSocialMediaModel,
} from '../user-social-medias/user-social-media.type';

export type IUser = {
  id: string;
  first_name: string;
  last_name: string;
  userName: string;
  email: string;
  dob: string;
  fathers_name?: string;
  mothers_name?: string;
  blood_group?: string;
  contact_number?: string;
  emergency_contact_number?: string;
  nid: string;
  permanent_address?: string;
  present_address?: string;
  tshirt?: TSHIRT_TYPE;
  tin_number?: string;
  gender: USER_GENDER_TYPE;
  marital_status?: USER_MARITAL_STATUS_TYPE;
  religion: RELIGION_TYPE;
  profile_picture?: string;
  is_registered: boolean;
  employment_infos?: IEmployee[];
  reporting_officers?: IEmployee[];
  current_employment_info?: IEmployee;
  current_employee_id?: string;
  current_status?: USER_CURRENT_STATUS_TYPE;
  roles?: Omit<IRole, 'description'>[];
  social_media?: IUserSocialMedia;
  billing_info?: IBillingInfo;
};

export type UserDto = {
  first_name: string;
  last_name: string;
  userName: string;
  email: string;
  dob: string;
  fathers_name?: string;
  mothers_name?: string;
  blood_group?: string;
  contact_number?: string;
  emergency_contact_number?: string;
  nid?: string;
  permanent_address?: string;
  password?: string;
  profile_picture?: string;
  present_address?: string;
  tshirt?: TSHIRT_TYPE;
  tin_number?: string;
  gender: USER_GENDER_TYPE;
  marital_status?: USER_MARITAL_STATUS_TYPE;
  religion: RELIGION_TYPE;
};
export type UpdateUserDto = Partial<UserDto>;

// Client create data transfer object
export type ClientDto = {
  first_name: string;
  last_name: string;
  userName: string;
  contact_number?: string;
  client_role_id: string;
  email: string;
} & Omit<BillingInfoDto, 'user_id'>;

// Client update data transfer object
export type UpdateClientDto = Partial<ClientDto>;

export type UpdateUserCurrentEmploymentDto = {
  current_employee_id: string;
};
export type PrismaUserModel = User & {
  employment_infos?: Employee_Info[];
  reporting_officers?: Employee_Info[];
  current_employment_info?: Employee_Info;
  user_roles?: PrismaUserRoleModel[];
  notification_preference?: User_Notification_Preference;
  social_media?: PrismaUserSocialMediaModel;
  billing_info?: PrismaBillingInfoModel;
};
