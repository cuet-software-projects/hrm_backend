import { Router } from 'express';
import EventController from './event.controller';
import validate from '../core/middlewares/validate';
import { EventSchema } from './events.schema';
import { eventService } from '../core/dependecies';
const eventRouter = Router();

const eventController = new EventController(eventService);

eventRouter.get('/events/:date', validate(EventSchema), eventController.getEvents);
export default eventRouter;
