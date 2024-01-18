import { z } from 'zod';
import { RELIGION, TSHIRT, USER_GENDER, USER_MARITAL_STATUS } from '../core/types';
import { isValidDate, isValidUUID } from '../utils/utils';
export const CreateUserSchema = z.object({
  body: z.object({
    first_name: z.string(),
    last_name: z.string(),
    userName: z.string(),
    email: z.string(),
    dob: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    fathers_name: z.string().optional(),
    mothers_name: z.string().optional(),
    blood_group: z.string().optional(),
    contact_number: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    nid: z.string().optional(),
    permanent_address: z.string().optional(),
    password: z.string(),
    profile_picture: z.string().optional(),
    present_address: z.string().optional(),
    tshirt: z.enum(TSHIRT).optional(),
    tin_number: z.string().optional(),
    gender: z.enum(USER_GENDER),
    marital_status: z.enum(USER_MARITAL_STATUS).optional(),
    religion: z.enum(RELIGION),
  }),
});

export const GetUserDetailsSchema = z.object({
  params: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const UpdateUserCurrentEmploymentSchema = z.object({
  body: z.object({
    current_employee_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
  params: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const UpdateUserSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    userName: z.string().optional(),
    email: z.string().optional(),
    dob: z.string().optional().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    fathers_name: z.string().optional(),
    mothers_name: z.string().optional(),
    blood_group: z.string().optional(),
    contact_number: z.string().optional(),
    emergency_contact_number: z.string().optional(),
    nid: z.string().optional(),
    permanent_address: z.string().optional(),
    password: z.string().optional(),
    profile_picture: z.string().optional(),
    present_address: z.string().optional(),
    tshirt: z.enum(TSHIRT).optional(),
    tin_number: z.string().optional(),
    gender: z.enum(USER_GENDER).optional(),
    marital_status: z.enum(USER_MARITAL_STATUS).optional(),
    religion: z.enum(RELIGION).optional(),
  }),
  params: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const UserRoleSchema = z.object({
  params: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
  body: z.object({
    role_ids: z.array(z.string().refine(isValidUUID, { message: 'Invalid Uuid' })),
  }),
});

export const UpdateUserPasswordSchema = z.object({
  params: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
  body: z.object({
    old_password: z.string().min(6),
    new_password: z.string().min(6),
  }),
});

// Create a client
export const CreateClientSchema = z.object({
  body: z.object({
    first_name: z.string(),
    last_name: z.string(),
    userName: z.string(),
    contact_number: z.string().optional(),
    client_role_id: z
      .string({ required_error: 'Assignment of client role is required.' })
      .refine(isValidUUID, { message: 'Invalid Uuid for role assignment!!!' }),
    email: z.string(),
  }),
});

// Update a client
export const UpdateClientSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    userName: z.string().optional(),
    contact_number: z.string().optional(),
    client_role_id: z.string().optional(),
    email: z.string().optional(),
  }),
});
