import { Router } from 'express';
import NoticeController from './notice.controller';
import { noticeService } from '../core/dependecies';
import validate from '../core/middlewares/validate';
import {
  CreateNoticeSchema,
  NoticePinnedSchema,
  UpdateNoticeSchema,
} from './notice.schema';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { handleMultipleFileUpload } from '../core/middlewares/multer-middleware';
import { parseRecipientIds } from '../utils/utils';

const noticeRouter = Router();

const noticeController = new NoticeController(noticeService);

// Get notices as pagination
noticeRouter.get('/', noticeController.getNotices);

// Get notices of user as pagination
noticeRouter.get('/recipients/:recipient_id', noticeController.getNoticesOfUser);

// Create a new notice
noticeRouter.post(
  '/',
  ValidateIdMiddleware.validateBodyId,
  handleMultipleFileUpload(5),
  parseRecipientIds,
  validate(CreateNoticeSchema),
  noticeController.createNotice,
);

// Update a notice
noticeRouter.patch(
  '/:notice_id',
  ValidateIdMiddleware.validateParamsId,
  handleMultipleFileUpload(5),
  parseRecipientIds,
  validate(UpdateNoticeSchema),
  noticeController.updateNotice,
);

// Get the pinned notice
noticeRouter.get('/pinned', noticeController.getPinnedNotice);

// Get a single notice details
noticeRouter.get(
  '/:notice_id',
  ValidateIdMiddleware.validateParamsId,
  noticeController.getNotice,
);

// Delete an attachment
noticeRouter.delete(
  '/:notice_id',
  ValidateIdMiddleware.validateParamsId,
  noticeController.deleteAttachmentOfNotice,
);

// Get number of active notices
// This will give total number of sent notices which has issue date from today to future
noticeRouter.get(
  '/active/:user_id',
  ValidateIdMiddleware.validateParamsId,
  noticeController.findTotalActiveNoticeOfUser,
);

// make a notice pinned
noticeRouter.patch(
  '/:notice_id/pinned',
  ValidateIdMiddleware.validateParamsId,
  validate(NoticePinnedSchema),
  noticeController.makeNoticePinned,
);

export default noticeRouter;
