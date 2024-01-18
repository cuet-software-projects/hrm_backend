import httpStatus from 'http-status';
import UserNotificationPreferenceRepository from '../user-notifications/user-notification.repository';
import UserRoleRepository from '../user-roles/user-role.repository';
import UserRepository from './user.repository';
import {
  ClientDto,
  IUser,
  PaginateResponse,
  PaginationQueryParams,
  PrismaUserModel,
  UpdateClientDto,
  UpdateUserCurrentEmploymentDto,
  UpdateUserDto,
  UserDto,
} from '../core/types';
import ApiError from '../utils/ApiError';
import BaseService from '../core/services/base.service';
import BcryptService from '../core/services/bcrypt.service';
import DocumentService from '../documents/document.service';
import NotificationService from '../core/services/notificaiton-service/notificationService';

export default class UserService extends BaseService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly bycrptService: BcryptService,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly userNotificationRepo: UserNotificationPreferenceRepository,
    private readonly notificationService: NotificationService,
    private readonly documentService: DocumentService,
  ) {
    super();
  }

  public async createUser(data: UserDto): Promise<IUser> {
    const hashPaassword = data.password
      ? await this.bycrptService.generateHash(data.password)
      : undefined;
    const newUser = await this.userRepo.createNewUser({
      ...data,
      password: hashPaassword,
    });

    await this.userNotificationRepo.createUserNotificationPreference(newUser.id);

    this.sentNotification({
      userId: newUser.id,
      callBackFunctionName: 'sendWelcomeNotification',
    });

    return newUser;
  }
  public async getUser(userId: string): Promise<IUser> {
    const user = await this.userRepo.getUser(userId);
    return user;
  }
  public async getAllUsers(): Promise<IUser[]> {
    const allUsers = await this.userRepo.getAllUsers();
    return allUsers;
  }

  // Get users with current employment (with pagination)
  public async getCurrentEmployees({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<IUser>> {
    const response = await this.userRepo.getCurrentEmployees({ ...params });
    return response;
  }

  // Get all users with current employment
  public async getAllCurrentEmployees(): Promise<IUser[]> {
    const allUsersWithCurrentEmployment = await this.userRepo.getAllCurrentEmployees();
    return allUsersWithCurrentEmployment;
  }

  public async getUsers({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<IUser>> {
    const response = await this.userRepo.getUsers({ ...params });
    return response;
  }
  public async updateUser(
    payload: UpdateUserDto,
    userId: string,
  ): Promise<UpdateUserDto> {
    try {
      const updatedUser = await this.userRepo.updateUser(payload, userId);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  public async getUserDetails(userId: string): Promise<IUser> {
    return await this.userRepo.getUserDetails(userId);
  }

  public async setEmploymentInfo({
    user_id,
    data,
  }: {
    data: UpdateUserCurrentEmploymentDto;
    user_id: string;
  }) {
    await this.userRepo.setCurrentEmployee(user_id, data.current_employee_id);
  }

  public async getUserLoginInfo(user_id: string) {
    const user = await this.userRepo.getUserLoginInfos(user_id);
    return user;
  }

  public async setUserRoles({
    role_ids,
    user_id,
  }: {
    role_ids: string[];
    user_id: string;
  }) {
    await this.userRoleRepo.updateUserRole({ role_ids, user_id });
  }

  public async uploadProfilePicture({
    user_id,
    file,
  }: {
    user_id: string;
    file: Express.Multer.File;
  }) {
    await this.runTransaction(async (transaction) => {
      const user = await this.userRepo.getUser(user_id);
      if (!!user.profile_picture) {
        await this.documentService.deleteDocument({
          type: 'USER',
          type_id: user_id,
          file_path: user.profile_picture,
        });
      }

      const document = await this.documentService.createDocument({
        file,
        type: 'USER',
        type_id: user_id,
      });
      // update profile picture
      await this.userRepo.updateUser({ profile_picture: document.file_path }, user_id);
    });
  }

  public async sentNotification({
    userId,
    callBackFunctionName,
  }: {
    userId: string;
    callBackFunctionName: string;
  }) {
    await this.notificationService.setUser(userId);
    await this.notificationService?.[callBackFunctionName]?.();
  }

  public async updatePassword({
    user_id,
    old_password,
    new_password,
  }: {
    user_id: string;
    old_password: string;
    new_password: string;
  }) {
    const user = await this.userRepo.findUniqueByKey<PrismaUserModel>('id', user_id);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Exists');
    }

    const isPasswordMatched = await this.bycrptService.compareHash(
      old_password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password Does not Matched');
    }
    const hashPassword = await this.bycrptService.generateHash(new_password);

    await this.userRepo.updateUser({ password: hashPassword }, user_id);
  }

  // Create a client
  public async createClient(data: ClientDto): Promise<IUser> {
    const newClient = await this.userRepo.createNewClient({
      ...data,
    });

    await this.userNotificationRepo.createUserNotificationPreference(newClient.id);

    this.sentNotification({
      userId: newClient.id,
      callBackFunctionName: 'sendWelcomeNotification',
    });

    return newClient;
  }

  // Update a client
  public async updateClient(
    payload: UpdateClientDto,
    userId: string,
  ): Promise<UpdateClientDto> {
    try {
      const updatedClient = await this.userRepo.updateClient(payload, userId);
      return updatedClient;
    } catch (error) {
      throw error;
    }
  }
}
