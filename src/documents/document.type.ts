import { DOCUMENT_ASSOCIATION_USER_TYPE, Document } from '@prisma/client';

export type FileType = {
  document_name: string;
  mime_type: string;
  size: number;
  file_path: string;
};

export type IDocument = FileType & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type PrismaDocumentModel = Document;
export type PrismaDocumentAssociationModel = {
  id: string;
  type: DOCUMENT_ASSOCIATION_USER_TYPE;
  type_id: string | null;
  document_id: string;
  document: PrismaDocumentModel;
  notice_id: string;
};
