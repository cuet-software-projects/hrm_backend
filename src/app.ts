import express from 'express';
import Router from './routes';
import cors from 'cors';
import httpStatus from 'http-status';
import ApiError from './utils/ApiError';
import { errorConverter, errorHandler } from './utils/error';
import yargs from 'yargs';
import {
  startUpdateUserActiveStatusJob,
  stopUpdateUserActiveStatusJob,
} from './jobs/updateUserActiveStatus';
import { validateEnv } from './core/schema/env.schema';
import { config } from 'dotenv';

export default class App {
  private readonly app: express.Application;
  private readonly port;

  constructor(port) {
    config();

    try {
      validateEnv(process.env);
    } catch (error) {
      console.error('Error validating environment variables:', error.message);
      process.exit(1);
    }

    this.port = port;
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json({ type: 'application/json' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.addV1Router(Router);
    this.app.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });
    this.app.use(errorConverter);
    this.app.use(errorHandler);
    this.command();
  }

  getApp() {
    return this.app;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`server is running on port ${this.port}`);
    });
  }

  addV1Router(router) {
    this.app.use('/api/v1', router);
  }

  startJobs() {
    startUpdateUserActiveStatusJob();
  }

  stopJobs() {
    stopUpdateUserActiveStatusJob();
  }

  command() {
    yargs
      .command({
        command: 'start-jobs',
        describe: 'Start scheduled jobs',
        handler: () => {
          this.startJobs();
        },
      })
      .command({
        command: 'stop-jobs',
        describe: 'Stop scheduled jobs',
        handler: () => {
          this.stopJobs();
        },
      })
      .help().argv;
  }
}
