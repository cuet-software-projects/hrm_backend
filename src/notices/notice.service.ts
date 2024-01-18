import { PaginateResponse, PaginationQueryParams } from '../core/types';
import NoticeRepository from './notice.repository';
import { INotice, NoticeDto, NoticePinnedDto, UpdateNoticeDto } from './notice.type';
import NoticeRecipientRepository from './noticeRecipient.repository';

export default class NoticeService {
  constructor(
    protected readonly noticeRepo: NoticeRepository,
    protected readonly noticeRecipientRepo: NoticeRecipientRepository,
  ) {}

  // Get notices as pagination
  public async getNotices({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<INotice>> {
    try {
      const response = await this.noticeRepo.getNotices({ ...params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get notices of a user as pagination
  public async getNoticesOfUser({
    params,
  }: {
    params: PaginationQueryParams & { recipientId: string };
  }): Promise<PaginateResponse<INotice>> {
    try {
      const response = await this.noticeRecipientRepo.getNoticesOfUser(params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a notice details
  public async getNoitce({ noticeId }: { noticeId: string }): Promise<INotice> {
    try {
      const response = await this.noticeRepo.getNotice({ noticeId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create a notice
  public async createNotice(payload: NoticeDto, files: Express.Multer.File[]) {
    const newNotice = await this.noticeRepo.createNotice(
      {
        ...payload,
      },
      files,
    );

    return newNotice;
  }

  // update a notice
  public async updateNotice(
    noticeId: string,
    payload: UpdateNoticeDto,
    files: Express.Multer.File[],
  ) {
    const newNotice = await this.noticeRepo.updateNotice({
      noticeId,
      data: payload,
      files,
    });

    return newNotice;
  }

  // Delete an attachment
  public async deleteAttachmentOfNotice({
    noticeId,
    file_path,
  }: {
    noticeId?: string;
    file_path: string;
  }) {
    await this.noticeRepo.deleteAttachmentOfNotice({
      noticeId,
      file_path,
    });
  }

  // Get number of active notices
  // This will give total number of sent notices which has issue date from today to future
  public async findTotalActiveNoticeOfUser(userId: string) {
    const totalNumber =
      await this.noticeRecipientRepo.findTotalActiveNoticeOfUser(userId);
    return totalNumber;
  }

  // make a notice pinned
  public async makeNoticePinned({
    payload,
    noticeId,
  }: {
    payload: NoticePinnedDto;
    noticeId: INotice['id'];
  }) {
    await this.noticeRepo.makeNoticePinned({ payload, noticeId });
  }

  // Get the pinned notice
  public async getPinnedNotice(): Promise<INotice> {
    const pinnedNotice = await this.noticeRepo.getPinnedNotice();

    return pinnedNotice;
  }
}
