import { type Prisma } from '@prisma/client';
import { PaginateResponse } from '../types';
import ApiError from '../../utils/ApiError';

export default class BaseRepository<DatabaseType> {
  protected db: DatabaseType;
  protected model: Prisma.ModelName;

  constructor(db: DatabaseType, model: Prisma.ModelName) {
    this.db = db;
    this.model = model;
  }

  public async create<formattedTypeData, parismaTypeData>(
    data: Partial<parismaTypeData>,
    transformer: (data: parismaTypeData) => formattedTypeData,
  ): Promise<formattedTypeData> {
    try {
      const newItem = await this.db[this.model].create({ data });
      return transformer(newItem);
    } catch (error) {
      throw error;
    }
  }

  public async update<FormattedDataType, PrismaTableType>(
    id: string,
    data: Partial<PrismaTableType>,
    transformer: (data: any) => FormattedDataType,
  ): Promise<FormattedDataType> {
    try {
      const updatedItem = await this.db[this.model].update({
        where: {
          id,
        },
        data,
      });
      return transformer(updatedItem);
    } catch (error) {
      throw error;
    }
  }

  public async get<FormattedDataType, PrismaTableType>(
    id: string,
    transform: (data: PrismaTableType) => FormattedDataType,
    options?: {
      includes?: any | any[]; // You can customize the type here
    },
    key?: string,
    value?: string,
  ): Promise<FormattedDataType> {
    try {
      const data: PrismaTableType = await this.db[this.model].findUnique({
        where: {
          [!!key ? key : 'id']: !!key ? value : id,
        },
        include: options?.includes,
      });
      if (!data) {
        throw new ApiError(404, 'This data do not Exits');
      }
      return transform(data);
    } catch (error) {
      throw error;
    }
  }

  public async getAll<FormattedDataType, PrismaTableType>(
    transformCollection: (data: PrismaTableType[]) => FormattedDataType[],
    options?: {
      orderBy?: any[] | any;
      includes?: any | any[]; // You can customize the type here
      where?: any;
    },
  ): Promise<FormattedDataType[]> {
    try {
      const allRawData = await this.db[this.model].findMany({
        orderBy: options?.orderBy,
        include: options?.includes,
        where: options?.where,
      });
      return transformCollection(allRawData);
    } catch (error) {
      throw error;
    }
  }

  public async findUniqueByKey<PrismaTableType>(
    key: string,
    value: any,
  ): Promise<PrismaTableType> {
    try {
      const data = await this.db[this.model].findUnique({
        where: {
          [key]: value,
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  public async findUniqueBySpecificKey<PrismaTableType>(
    specificKey: string,
    value: any,
  ): Promise<PrismaTableType> {
    try {
      const data = await this.db[this.model].findUnique({
        where: {
          [specificKey]: value,
        },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  public async delete<T>(id: string, transformer: (data: any) => T): Promise<T> {
    try {
      const deletedUser = await this.db[this.model].delete({
        where: {
          id,
        },
      });
      return transformer(deletedUser);
    } catch (error) {
      throw error;
    }
  }

  public async paginate<FormattedDataType, PrismaTableType>({
    page,
    pageSize,
    transformCollection,
    options = {} as {
      where?: any;
      orderBy?: any[] | any;
      includes?: any | any[];
    },
  }: {
    page: number;
    pageSize: number;
    transformCollection: (data: PrismaTableType[]) => FormattedDataType[];
    options?: {
      where?: any;
      orderBy?: any[] | any;
      includes?: any | any[]; // You can customize the type here
    };
  }): Promise<PaginateResponse<FormattedDataType>> {
    const skip = (page - 1) * pageSize;
    const totalItems = await this.db[this.model].count({
      where: options?.where,
    }); // Get the total count of items

    try {
      const data = await this.db[this.model].findMany({
        where: options?.where,
        orderBy: options?.orderBy,
        skip,
        take: pageSize,
        include: options?.includes,
      });

      const totalPages = totalItems != 0 ? Math.ceil(totalItems / pageSize) : 0;
      return {
        data: transformCollection(data),
        meta: {
          totalItems,
          totalPages,
          perPage: pageSize,
          currentPage: page,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
