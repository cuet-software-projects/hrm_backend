import { Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import { PaginateResponse, Request } from '../core/types';
import catchAsync from '../utils/catchAsync';
import NoticeService from './notice.service';
import { INotice, NoticeDto, NoticePinnedDto, UpdateNoticeDto } from './notice.type';

export default class NoticeController {
  constructor(protected readonly noticeService: NoticeService) {}

  // Get notices as pagination
  public getNotices = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, search, sorts } = req.query;

    const response: PaginateResponse<INotice> = await this.noticeService.getNotices({
      params: {
        page: Number(page ?? 1),
        limit: Number(limit ?? 10),
        filters: filters as Record<string, any>,
        includes: includes as string,
        search: search as string,
        sorts: sorts as string,
      },
    });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  // Get notices of a user as pagination
  public getNoticesOfUser = catchAsync(async (req: Request, res: Response) => {
    const { recipient_id } = req.params;
    const { page, limit, filters, includes, search, sorts } = req.query;

    const response: PaginateResponse<INotice> = await this.noticeService.getNoticesOfUser(
      {
        params: {
          page: Number(page ?? 1),
          limit: Number(limit ?? 10),
          filters: filters as Record<string, any>,
          includes: includes as string,
          search: search as string,
          sorts: sorts as string,
          recipientId: recipient_id,
        },
      },
    );

    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  // Create a notice
  public createNotice = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as NoticeDto;
    const newNotice = await this.noticeService.createNotice(
      payload,
      req.files as Express.Multer.File[],
    );
    apiResponse.sendSuccess({ res: res, data: newNotice, code: 201 });
  });

  // Update a notice
  public updateNotice = catchAsync(async (req: Request, res: Response) => {
    const { notice_id } = req.params;
    const payload = req.body as UpdateNoticeDto;
    const updatedNotice = await this.noticeService.updateNotice(
      notice_id,
      payload,
      req.files as Express.Multer.File[],
    );
    apiResponse.sendSuccess({ res: res, data: updatedNotice, code: 201 });
  });

  // Get the details of a notice
  public getNotice = catchAsync(async (req: Request, res: Response) => {
    const { notice_id } = req.params;
    const noticeData = await this.noticeService.getNoitce({ noticeId: notice_id });
    return apiResponse.sendSuccess({ res: res, data: noticeData, code: 201 });
  });

  // Delete an attachment
  public deleteAttachmentOfNotice = catchAsync(async (req: Request, res: Response) => {
    const { notice_id } = req.params;
    const { file_path } = req.query;
    const attachmentData = await this.noticeService.deleteAttachmentOfNotice({
      noticeId: notice_id,
      file_path: file_path as string,
    });
    return apiResponse.sendSuccess({ res: res, data: attachmentData, code: 204 });
  });

  // Get number of active notices
  // This will give total number of sent notices which has issue date from today to future
  public findTotalActiveNoticeOfUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.user_id;
    const totalNumberOfActiveNotices =
      await this.noticeService.findTotalActiveNoticeOfUser(userId);
    return apiResponse.sendSuccess({
      res: res,
      data: {
        totalNumber: totalNumberOfActiveNotices,
      },
      code: 200,
    });
  });

  // make a notice pinned
  public makeNoticePinned = catchAsync(async (req: Request, res: Response) => {
    const { notice_id } = req.params;
    await this.noticeService.makeNoticePinned({
      noticeId: notice_id,
      payload: req.body as NoticePinnedDto,
    });
    return apiResponse.sendSuccess({ res: res, code: 201 });
  });

  // Get the pinned notice
  public getPinnedNotice = catchAsync(async (req: Request, res: Response) => {
    const pinnedNotice = await this.noticeService.getPinnedNotice();
    return apiResponse.sendSuccess({ res: res, data: pinnedNotice, code: 200 });
  });
}
