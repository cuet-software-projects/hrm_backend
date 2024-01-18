import {
  Document,
  Document_Association,
  Notice,
  NoticeRecipient,
  User,
} from '@prisma/client';
import { IDocument } from '../documents/document.type';
import { IUser } from '../users/user.type';
import { NOTICE_TYPE } from '../core/types';
import { bool } from 'aws-sdk/clients/signer';

export type NoticeDto = {
  issue_date: string;
  subject: string;
  content: string;
  status: NOTICE_TYPE;
  recipient_ids: string[];
  sender_id: string;
};

export type UpdateNoticeDto = Partial<NoticeDto>;

export type NoticePinnedDto = {
  is_pinned: boolean;
};

export type INotice = {
  id: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  issue_date: string;
  status: NOTICE_TYPE;
  recipients: Omit<IUser, 'is_registered'>[];
  sender?: Omit<IUser, 'is_registered'>;
  sender_id: string;
  attachments?: IDocument[];
};

export type PrismaNoticeModel = Notice & {
  recipients: User[];
  sender: User;
  attachments?: Document_Association[];
};

export type PrismaNoticeRecipientModel = NoticeRecipient & {
  notice: PrismaNoticeModel;
};
