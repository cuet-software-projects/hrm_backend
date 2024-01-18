import { PrismaClient } from '@prisma/client';
import { db } from '../../db.server';

type TransactionCallback<T> = (prisma: PrismaClient) => Promise<T>;

export default class BaseService {
  public async runTransaction<T>(callback: TransactionCallback<T>): Promise<T> {
    try {
      return await db.$transaction(callback, {
        maxWait: 5000,
        timeout: 10000,
      });
    } catch (error) {
      throw error;
    } finally {
      await db.$disconnect();
    }
  }
}
