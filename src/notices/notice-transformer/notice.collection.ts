import { CollectionTransformer } from '../../core/transformer/transformer';
import { INotice, PrismaNoticeModel, PrismaNoticeRecipientModel } from '../notice.type';
import noticeResource from './notice.transformer';

class NoticeCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaNoticeModel[]): INotice[] {
    return requestedData.map((notice) => noticeResource.transform(notice));
  }
  // Convert the notice recipient collection to notice collection
  transformNoticeRecipientCollectionToNoticeCollection(
    requestedData: PrismaNoticeRecipientModel[],
  ): INotice[] {
    return requestedData.map((noticeRecipient) =>
      noticeResource.transformNoticeRecipientToNotice(noticeRecipient),
    );
  }
}

const noticeCollection = new NoticeCollection();

export default noticeCollection;
