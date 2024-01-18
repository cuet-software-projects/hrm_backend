import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createUserFakeData, createUserFakeList } from '../@fakeDb';
import App from '../app';
import { userService } from '../core/dependecies';
import { IUser, PaginationQueryParams, UserDto } from '../core/types';
import request from 'supertest';
import UserRepository from '../users/user.repository';

const app = new App(5057).getApp();
const userFakeData = createUserFakeData();
const userFakeList = createUserFakeList();
jest.mock('../auth/auth', () => ({
  verifyToken: jest.fn((req, res, next) => {
    next();
  }),
}));

// describe('user', () => {
//   let consoleErrorSpy: jest.SpyInstance;

//   beforeEach(() => {
//     // Mock console.error to suppress its output
//     consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//     consoleErrorSpy.mockRestore();
//   });

//   describe('POST /users', () => {
//     describe('given the user all information valid', () => {
//       it('should return success response with user data', async () => {
//         const { id, ...userPayload } = userFakeData;

//         const createdUserId = 'ID';
//         //@ts-ignore
//         const createUserMock = jest
//           .spyOn(userService, 'createUser')
//           .mockResolvedValueOnce({ ...userPayload, id: createdUserId } as IUser);
//         const response = await request(app)
//           .post('/api/v1/user')
//           .send(userPayload)
//           .expect(201);

//         expect(createUserMock).toHaveBeenCalledWith(userPayload);
//         expect(response.body).toEqual({
//           message: 'Successful',
//           isSuccess: true,
//           statusCode: 201,
//           data: {
//             ...userPayload,
//             id: createdUserId,
//           },
//         });
//       });
//     });

//     describe('given the username missing', () => {
//       it('should return 400 error', async () => {
//         const { email, ...userPayload } = userFakeData;

//         const response = await request(app)
//           .post('/api/v1/user')
//           .send(userPayload)
//           .expect(400);

//         expect(response.body).toEqual(
//           expect.objectContaining({
//             message: 'Required',
//             isSuccess: false,
//             statusCode: 400,
//           }),
//         );
//       });
//     });

//     describe('given the password missing', () => {
//       it('should return 400 error', async () => {
//         const { password, ...userPayload } = userFakeData;

//         const response = await request(app)
//           .post('/api/v1/user')
//           .send(userPayload)
//           .expect(400);

//         expect(response.body).toEqual(
//           expect.objectContaining({
//             message: 'Required',
//             isSuccess: false,
//             statusCode: 400,
//           }),
//         );
//       });
//     });

//     describe('given the username duplicate', () => {
//       // it('should return 400 error', async () => {
//       //   const userPayload = userFakeData as UserDto;
//       //   //@ts-ignore
//       //   const createUserMock = jest
//       //     .spyOn(userService, 'createUser')
//       //     .mockRejectedValueOnce(
//       //       new PrismaClientKnownRequestError(
//       //         'Unique constraint failed on the constraint: `users_userName_key`',
//       //         {
//       //           code: 'P2002',
//       //         }
//       //       ),
//       //     );

//       //   const response = await request(app)
//       //     .post('/api/v1/user')
//       //     .send(userPayload)
//       //     .expect(400);

//       //   expect(createUserMock).toHaveBeenCalledWith(userPayload);

//       //   expect(response.body).toEqual(
//       //     expect.objectContaining({
//       //       message: 'Duplicate entry in field: users_userName_key',
//       //       isSuccess: false,
//       //       statusCode: 400,
//       //     }),
//       //   );
//       // });
//     });

//     // describe('given the email duplicate', () => {
//     //   it('should return 400 error', async () => {
//     //     const userPayload = userFakeData as UserDto;
//     //     //@ts-ignore
//     //     const createUserMock = jest
//     //       .spyOn(userService, 'createUser')
//     //       .mockRejectedValueOnce(
//     //         new PrismaClientKnownRequestError(
//     //           'Unique constraint failed on the constraint: `users_email_key`',
//     //           {
//     //             code: 'P2002',
//     //           } as KnownErrorParams,
//     //         ),
//     //       );

//     //     const response = await request(app)
//     //       .post('/api/v1/user')
//     //       .send(userPayload)
//     //       .expect(400);

//     //     expect(createUserMock).toHaveBeenCalledWith(userPayload);

//     //     expect(response.body).toEqual(
//     //       expect.objectContaining({
//     //         message: 'Duplicate entry in field: users_email_key',
//     //         isSuccess: false,
//     //         statusCode: 400,
//     //       }),
//     //     );
//     //   });
//     // });

//     describe('given the nid duplicate', () => {
//       it('should return 400 error', async () => {
//         const userPayload = userFakeData as UserDto;
//         //@ts-ignore
//         const createUserMock = jest
//           .spyOn(userService, 'createUser')
//           .mockRejectedValueOnce(
//             new PrismaClientKnownRequestError(
//               'Unique constraint failed on the constraint: `users_nid_key`',
//               {
//                 code: 'P2002',
//               } as KnownErrorParams,
//             ),
//           );

//         const response = await request(app)
//           .post('/api/v1/user')
//           .send(userPayload)
//           .expect(400);

//         expect(createUserMock).toHaveBeenCalledWith(userPayload);

//         expect(response.body).toEqual(
//           expect.objectContaining({
//             message: 'Duplicate entry in field: users_nid_key',
//             isSuccess: false,
//             statusCode: 400,
//           }),
//         );
//       });
//     });

//     describe('given the tin duplicate', () => {
//       it('should return 400 error', async () => {
//         const userPayload = userFakeData as UserDto;
//         //@ts-ignore
//         const createUserMock = jest
//           .spyOn(userService, 'createUser')
//           .mockRejectedValueOnce(
//             new PrismaClientKnownRequestError(
//               'Unique constraint failed on the constraint: `users_tin_key`',
//               {
//                 code: 'P2002',
//               } as KnownErrorParams,
//             ),
//           );

//         const response = await request(app)
//           .post('/api/v1/user')
//           .send(userPayload)
//           .expect(400);

//         expect(createUserMock).toHaveBeenCalledWith(userPayload);

//         expect(response.body).toEqual(
//           expect.objectContaining({
//             message: 'Duplicate entry in field: users_tin_key',
//             isSuccess: false,
//             statusCode: 400,
//           }),
//         );
//       });
//     });
//   });

//   describe('GET /users/all', () => {
//     describe('request all users', () => {
//       it('should return success response with user data', async () => {
//         //@ts-ignore
//         const createUserMock = jest
//           .spyOn(userService, 'getAllUsers')
//           .mockResolvedValueOnce(userFakeList as IUser[]);
//         const response = await request(app).get('/api/v1/users/all').expect(200);

//         expect(createUserMock).toHaveBeenCalledWith();
//         expect(response.body).toEqual({
//           message: 'Successful',
//           isSuccess: true,
//           statusCode: 200,
//           data: userFakeList,
//         });

//         expect(response.body.data).toHaveLength(userFakeList.length);
//       });
//     });
//   });

//   describe('Get /users', () => {
//     describe('request paginated users', () => {
//       it('should return success response with user paginated data', async () => {
//         const params = {
//           page: 1,
//           limit: 10,
//         };

//         const getUsersSpy = jest
//           .spyOn(UserRepository.prototype, 'getUsers')
//           .mockResolvedValue({
//             data: userFakeList.slice(0, params.limit),
//             meta: {
//               totalItems: userFakeList.length,
//               totalPages: userFakeList.length / params.limit,
//               perPage: params.limit,
//               currentPage: params.page,
//             },
//           });

//         const response = await request(app).get('/api/v1/users').query(params);

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({
//           message: 'Successful',
//           isSuccess: true,
//           statusCode: 200,
//           data: userFakeList.slice(0, params.limit),
//           meta: {
//             totalItems: userFakeList.length,
//             totalPages: userFakeList.length / params.limit,
//             perPage: params.limit,
//             currentPage: params.page,
//           },
//         });

//         expect(getUsersSpy).toHaveBeenCalledWith({
//           page: Number(params.page),
//           limit: Number(params.limit),
//         });

//         getUsersSpy.mockRestore();
//       });
//     });
//   });
// });
