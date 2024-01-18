import { PrismaClient } from '@prisma/client';
import { getAppEnvironment } from './configs/env-config';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({
    log: getAppEnvironment() === 'development' ? ['query', 'info', 'warn', 'error'] : [],
  });
}

db = global.__db;

type DbType = typeof db;

export type { DbType };

export { db };
