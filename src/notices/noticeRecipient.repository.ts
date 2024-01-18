import BaseRepository from '../core/repository/base.repository';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { DbType, db } from '../db.server';
import noticeCollection from './notice-transformer/notice.collection';
import { INotice } from './notice.type';
import { buildWhereObject, buildIncludesObject, findSortingType } from '../utils/utils';
import dayjs from 'dayjs';

export default class NoticeRecipientRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'NoticeRecipient');
  }

  // Get Notices of specific users
  public async getNoticesOfUser({
    page,
    limit,
    filters,
    includes = '',
    search,
    sorts,
    recipientId,
  }: PaginationQueryParams & { recipientId: string }): Promise<
    PaginateResponse<INotice>
  > {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    try {
      const includeArray = includes.split(',');

      const response = await this.paginate({
        page,
        pageSize: limit,
        transformCollection:
          noticeCollection.transformNoticeRecipientCollectionToNoticeCollection,
        options: {
          includes: {
            ...buildIncludesObject(includeArray ?? []),
            notice: {
              include: {
                sender: true,
              },
            },
          },
          where: {
            recipient_id: recipientId,
            notice: {
              ...buildWhereObject(filters),
              issue_date: {
                lte: todayEnd,
              },
            },
          },
          orderBy: [{ notice: { issue_date: findSortingType(sorts) } }],
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get number of active notices
  // This will give total number of sent notices which has issue date from today to future
  public async findTotalActiveNoticeOfUser(userId: string): Promise<number> {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    try {
      const totalNumberOfActiveNotices = await db.noticeRecipient.count({
        where: {
          recipient_id: userId,
          notice: {
            status: 'SENT',
            issue_date: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
      });

      return totalNumberOfActiveNotices;
    } catch (error) {
      throw error;
    }
  }
}
