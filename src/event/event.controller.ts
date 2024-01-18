import { NextFunction, Request, Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import EventService from './event.service';
import catchAsync from '../utils/catchAsync';

export default class EventController {
  constructor(protected readonly eventService: EventService) {}
  public getEvents = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const date = req.params.date as string;

      const data = await this.eventService.getTodaysEvent(date);
      apiResponse.sendSuccess({
        res,
        code: 200,
        data,
      });
    },
  );
}
