import { DOCUMENT_ASSOCIATION_USER_TYPE, Notice } from '@prisma/client';
import BaseRepository from '../core/repository/base.repository';
import { DbType, db } from '../db.server';
import noticeResource from './notice-transformer/notice.transformer';

import {
  INotice,
  NoticeDto,
  NoticePinnedDto,
  PrismaNoticeModel,
  UpdateNoticeDto,
} from './notice.type';
import dayjs from 'dayjs';
import { documentService } from '../core/dependecies';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
import noticeCollection from './notice-transformer/notice.collection';

export default class NoticeRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Notice');
  }

  // Get all notices with pagiation
  public async getNotices({
    page,
    limit,
    filters,
    includes = '',
    search,
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<INotice>> {
    try {
      const includeArray = includes.split(',');

      const options = {
        page,
        pageSize: limit,
        transformCollection: noticeCollection.transformCollection,
        options: {
          includes: buildIncludesObject(includeArray ?? []),
          where: buildWhereObject(filters),
          orderBy: buildSortObject(sorts),
        },
      };

      if (filters && filters.hasOwnProperty('is_pinned')) {
        const { is_pinned, ...filtersWithoutIspinned } = filters;
        options.options.where = {
          ...options.options.where,
          ...buildWhereObject(filtersWithoutIspinned),
          is_pinned: {
            equals: is_pinned.length > 0 ? is_pinned === 'true' : undefined,
          },
        };
      }

      const response = await this.paginate(options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a notice details
  public async getNotice({ noticeId }: { noticeId: string }): Promise<INotice> {
    try {
      const noticeDetails = await this.get<INotice, Notice>(
        noticeId,
        noticeResource.transform,
        {
          includes: {
            recipients: {
              include: {
                recipient: {
                  select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    profile_picture: true,
                  },
                },
              },
            },
            attachments: {
              include: {
                document: true,
              },
            },
            sender: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        },
      );

      return noticeDetails;
    } catch (error) {
      throw error;
    }
  }

  // create a notice
  public async createNotice(
    data: NoticeDto,
    files: Express.Multer.File[],
  ): Promise<INotice> {
    let createdNotice: INotice;

    try {
      await db.$transaction(async (prismaClient) => {
        // Create the notice
        createdNotice = await this.create<INotice, Notice>(
          {
            content: data.content,
            issue_date: dayjs(data.issue_date).toDate(),
            sender_id: data.sender_id,
            subject: data.subject,
            status: data.status,
          },
          noticeResource.transform,
        );

        // It will create the recipients of a notice
        const recipientIds = data.recipient_ids.map((recipientId: string) => ({
          notice_id: createdNotice.id,
          recipient_id: recipientId,
        }));

        await db.noticeRecipient.createMany({
          data: recipientIds,
        });

        // Upload the attachments
        if (files && files.length > 0) {
          for (const file of files) {
            // Create a document
            await documentService.createDocument({
              file,
              type: 'NOTICE',
              type_id: createdNotice.id,
              notice_id: createdNotice.id,
            });
          }
        }
      });

      return createdNotice;
    } catch (error) {
      throw error;
    }
  }

  // Update a notice
  public async updateNotice({
    noticeId,
    data,
    files,
  }: {
    noticeId: string;
    data: UpdateNoticeDto;
    files: Express.Multer.File[];
  }) {
    let updatedNotice: INotice;

    try {
      await db.$transaction(async (prismaClient) => {
        // Create the notice
        updatedNotice = (await this.update<UpdateNoticeDto, Notice>(
          noticeId,
          {
            ...(data.content && { content: data.content }),
            ...(data.issue_date && { issue_date: dayjs(data.issue_date).toDate() }),
            ...(data.sender_id && { sender_id: data.sender_id }),
            ...(data.subject && { content: data.subject }),
            ...(data.status && { status: data.status }),
          },
          noticeResource.transform,
        )) as INotice;

        if (data.recipient_ids) {
          // It will create the recipients of a notice
          const recipientIds = data.recipient_ids.map((recipientId: string) => ({
            notice_id: updatedNotice.id,
            recipient_id: recipientId,
          }));

          await db.noticeRecipient.deleteMany({
            where: {
              notice_id: noticeId,
            },
          });

          await db.noticeRecipient.createMany({
            data: recipientIds,
          });
        }

        // Upload the attachments
        if (files && files.length > 0) {
          for (const file of files) {
            // Create a document
            await documentService.createDocument({
              file,
              type: 'NOTICE',
              type_id: updatedNotice.id,
              notice_id: updatedNotice.id,
            });
          }
        }
      });

      return updatedNotice;
    } catch (error) {
      throw error;
    }
  }

  // Delete an attachment
  public async deleteAttachmentOfNotice({
    noticeId,
    file_path,
  }: {
    noticeId?: string;
    file_path: string;
  }) {
    try {
      await documentService.deleteDocument({
        file_path,
        type: 'NOTICE',
        type_id: noticeId,
      });
    } catch (error) {
      throw error;
    }
  }

  // make a notice pinned
  public async makeNoticePinned({
    payload,
    noticeId,
  }: {
    payload: NoticePinnedDto;
    noticeId: INotice['id'];
  }) {
    try {
      if (payload.is_pinned) {
        await db.notice.updateMany({
          where: {
            id: { not: noticeId },
          },
          data: {
            is_pinned: false,
          },
        });
      }

      await db.notice.update({
        where: {
          id: noticeId,
        },
        data: {
          is_pinned: payload.is_pinned,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Get the pinned notice
  // Get a notice details
  public async getPinnedNotice(): Promise<INotice | null> {
    try {
      const pinnedNotice = await db.notice.findFirst({
        where: {
          is_pinned: true,
        },
      });

      return pinnedNotice
        ? noticeResource.transform(pinnedNotice as PrismaNoticeModel)
        : null;
    } catch (error) {
      throw error;
    }
  }
}
