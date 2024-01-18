import { Billing_Info, User } from '@prisma/client';
import dayjs from 'dayjs';
import { DbType, db } from '../db.server';
import userCollection from './user-transformer/user.collection';
import userResource from './user-transformer/user.resource';
import {
  ClientDto,
  IUser,
  PaginateResponse,
  PaginationQueryParams,
  UpdateClientDto,
  UpdateUserDto,
  UserDto,
} from '../core/types';
import {
  buildIncludesObject,
  buildSearchQuery,
  buildSortObject,
  buildWhereObject,
} from '../utils/utils';
import BaseRepository from '../core/repository/base.repository';
import BaseService from '../core/services/base.service';

export default class UserRepository extends BaseRepository<DbType> {
  constructor(protected readonly baseService: BaseService) {
    super(db, 'User');
  }

  public async createNewUser(data: UserDto) {
    try {
      const newTeam = await this.create<IUser, User>(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          fathers_name: data.fathers_name,
          mothers_name: data.mothers_name,
          userName: data.userName,
          email: data.email,
          dob: data.dob,
          blood_group: data.blood_group,
          contact_number: data.contact_number,
          emergency_contact_number: data.emergency_contact_number,
          nid: data.nid,
          permanent_address: data.permanent_address,
          present_address: data.present_address,
          tshirt: data.tshirt,
          tin_number: data.tin_number,
          gender: data.gender,
          marital_status: data.marital_status,
          religion: data.religion,
          profile_picture: data.profile_picture,
          password: data.password,
          is_registered: !!data.password,
        },
        userResource.transform,
      );
      return newTeam;
    } catch (error) {
      throw error;
    }
  }
  public async updateUser(
    payload: UpdateUserDto,
    userId: string,
  ): Promise<UpdateUserDto> {
    try {
      const {
        first_name,
        last_name,
        userName,
        email,
        dob,
        fathers_name,
        mothers_name,
        blood_group,
        contact_number,
        emergency_contact_number,
        nid,
        permanent_address,
        password,
        profile_picture,
        present_address,
        tshirt,
        tin_number,
        gender,
        marital_status,
        religion,
      } = payload;

      const updatedUser = await this.update<UpdateUserDto, User>(
        userId,
        {
          ...(first_name && { first_name }),
          ...(last_name && { last_name }),
          ...(userName && { userName }),
          ...(email && { email }),
          ...(dob && { dob }),
          ...(fathers_name && { fathers_name }),
          ...(mothers_name && { mothers_name }),
          ...(blood_group && { blood_group }),
          ...(contact_number && { contact_number }),
          ...(emergency_contact_number && { emergency_contact_number }),
          ...(nid && { nid }),
          ...(permanent_address && { permanent_address }),
          ...(password && { password, is_registered: true }),
          ...(profile_picture && { profile_picture }),
          ...(present_address && { present_address }),
          ...(tshirt && { tshirt }),
          ...(tin_number && { tin_number }),
          ...(gender && { gender }),
          ...(marital_status && { marital_status }),
          ...(religion && { religion }),
        },

        userResource.transform,
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  public async getAllUsers(): Promise<IUser[]> {
    try {
      const allUsers = await this.getAll<IUser, User>(userCollection.transformCollection);
      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  // Get users with current employment (with pagination)
  public async getCurrentEmployees({
    page,
    limit,
    filters,
    includes = '',
  }: PaginationQueryParams): Promise<PaginateResponse<IUser>> {
    try {
      const includeArray = includes.split(',');

      const response = await this.paginate({
        page,
        pageSize: limit,
        transformCollection: userCollection.transformCollection,
        options: {
          includes: buildIncludesObject(includeArray ?? []),
          where: {
            ...buildWhereObject(filters),
            current_employment_info: {
              isNot: null,
            },
          },
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with current employment
  public async getAllCurrentEmployees(): Promise<IUser[]> {
    try {
      const allCurrentEmployees = await this.getAll<IUser, User>(
        userCollection.transformCollection,
        {
          includes: {
            current_employment_info: true,
          },
          where: {
            current_employment_info: {
              isNot: null,
            },
          },
        },
      );
      return allCurrentEmployees;
    } catch (error) {
      throw error;
    }
  }

  public async getUserDetails(userId: string): Promise<IUser> {
    try {
      const userDetails = await db.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          current_employment_info: {
            include: {
              current_employee_designation: true,
            },
          },
          employment_infos: {
            include: {
              branch: true,
              department: true,
              current_employee_designation: true,
              reporting_officer: true,
            },
            orderBy: [
              {
                created_at: 'desc',
              },
            ],
          },
          user_roles: {
            include: {
              role: true,
            },
          },
          billing_info: true,
          social_media: true,
        },
      });
      return userResource.transform(userDetails);
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(paylodEmail: string): Promise<User> {
    try {
      const user = await db.user.findUnique({
        where: {
          email: paylodEmail,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  public async setCurrentEmployee(user_id: string, employeeInfoId?: string) {
    try {
      const updatedData = await db.user.update({
        where: {
          id: user_id,
        },
        data: {
          current_employee_id: employeeInfoId,
        },
      });
      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  public async removeCurrentEmployee(user_id: string) {
    try {
      const updatedData = await db.user.update({
        where: {
          id: user_id,
        },
        data: {
          current_employee_id: null,
        },
      });
      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  public async getUser(userId: string): Promise<IUser> {
    try {
      const user = await this.get<IUser, User>(userId, userResource.transform);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUsers({
    page,
    limit,
    filters,
    includes = '',
    search,
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<IUser>> {
    try {
      const includeArray = includes.split(',');

      const searchQuery = buildSearchQuery(search, [
        'first_name',
        'last_name',
        'email',
        'userName',
        'contact_number',
      ]);

      const response = await this.paginate({
        page,
        pageSize: limit,
        transformCollection: userCollection.transformCollection,
        options: {
          includes: buildIncludesObject(includeArray ?? []),
          where: {
            ...buildWhereObject(filters),
            ...searchQuery,
          },
          orderBy: buildSortObject(sorts),
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getUserLoginInfos<T>(user_id: string) {
    try {
      const response = await db.user.findUnique({
        where: {
          id: user_id,
        },
        include: {
          current_employment_info: true,
          user_roles: {
            include: {
              role: true,
            },
          },
        },
      });
      return userResource.transform(response) as T;
    } catch (error) {
      throw error;
    }
  }

  public async getUsersByBirthday(date: string): Promise<IUser[]> {
    const receivedDate = dayjs(date);
    const todayString = receivedDate.format('MM-DD');
    try {
      const users = await db.user.findMany({
        where: {
          dob: {
            endsWith: todayString,
          },
        },
        include: {
          current_employment_info: {
            include: {
              current_employee_designation: true,
            },
          },
        },
      });
      return userCollection.transformCollection(users);
    } catch (error) {
      throw error;
    }
  }

  public async getTodaysUserAnniversary(date: string) {
    try {
      const usersWithOldestEmploymentInfo = await db.user.findMany({
        include: {
          employment_infos: {
            where: {
              joined_at: dayjs(date).toDate(),
            },
            orderBy: {
              joined_at: 'asc',
            },
            take: 1,
          },
        },
      });

      return userCollection.transformCollection(usersWithOldestEmploymentInfo);
    } catch (error) {
      throw error;
    }
  }

  // Create a new client
  public async createNewClient(data: ClientDto) {
    try {
      return this.baseService.runTransaction(async () => {
        const newClient = await this.create<IUser, User>(
          {
            first_name: data.first_name,
            last_name: data.last_name,
            userName: data.userName,
            contact_number: data.contact_number,
            email: data.email,
            is_registered: false,
          },
          userResource.transform,
        );

        await db.user_Role.create({
          data: {
            role_id: data.client_role_id,
            user_id: newClient.id,
          },
        });

        await db.billing_Info.create({
          data: {
            address_line_1: data.address_line_1,
            address_line_2: data.address_line_2,
            city: data.city,
            state: data.state,
            country: data.country,
            zip_code: data.zip_code,
            user_id: newClient.id,
          },
        });

        return newClient;
      });
    } catch (error) {
      throw error;
    }
  }

  // Update a client
  public async updateClient(
    payload: UpdateClientDto,
    userId: string,
  ): Promise<UpdateClientDto> {
    try {
      const {
        first_name,
        last_name,
        userName,
        contact_number,
        email,
        address_line_1,
        address_line_2,
        city,
        country,
        state,
        zip_code,
      } = payload;

      const updatedClient = await this.update<UpdateClientDto, User>(
        userId,
        {
          ...(first_name && { first_name }),
          ...(last_name && { last_name }),
          ...(userName && { userName }),
          ...(contact_number && { contact_number }),
          ...(email && { email }),
        },
        userResource.transform,
      );

      const updatedBillingInfo = await db.billing_Info.update({
        data: {
          ...(address_line_1 && {
            address_line_1,
          }),
          ...(address_line_2 && {
            address_line_2,
          }),
          ...(city && {
            city,
          }),
          ...(country && {
            country,
          }),
          ...(state && {
            state,
          }),
          ...(zip_code && {
            zip_code,
          }),
        },
        where: {
          user_id: userId,
        },
      });

      return { ...updatedClient, ...updatedBillingInfo };
    } catch (error) {
      throw error;
    }
  }
}
