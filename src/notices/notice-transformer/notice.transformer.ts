import dayjs from 'dayjs';
import { Transformer } from '../../core/transformer/transformer';
import { INotice, PrismaNoticeModel, PrismaNoticeRecipientModel } from '../notice.type';
import documentResource from '../../documents/document-transformer/document.resource';
import { PrismaDocumentAssociationModel } from '../../documents/document.type';

class NoticeResource implements Transformer {
  transform(notice: PrismaNoticeModel): INotice {
    const attachments = notice.attachments as PrismaDocumentAssociationModel[];
    return {
      id: notice.id,
      content: notice.content as string,
      created_at: dayjs(notice.created_at).toISOString(),
      updated_at: dayjs(notice.created_at).toISOString(),
      issue_date: dayjs(notice.issue_date).toISOString(),
      is_pinned: notice.is_pinned,
      recipients: notice.recipients,
      sender_id: notice.sender_id,
      sender: notice.sender,
      subject: notice.subject,
      attachments:
        attachments &&
        attachments.map((doc_ass) => documentResource.transform(doc_ass.document)),
      status: notice.status,
    };
  }
  // Convert notice recipient to notice
  transformNoticeRecipientToNotice(noticeRecipient: PrismaNoticeRecipientModel): INotice {
    return this.transform(noticeRecipient.notice);
  }
}

const noticeResource = new NoticeResource();

export default noticeResource;
