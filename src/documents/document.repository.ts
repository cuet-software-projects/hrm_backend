import { Document } from '@prisma/client';
import { DbType, db } from '../db.server';
import documentResource from './document-transformer/document.resource';
import { FileType, IDocument } from '../core/types';
import BaseRepository from '../core/repository/base.repository';
export default class DocumentRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Document');
  }

  public async createDocument(document: FileType) {
    try {
      const newDocument = this.create<IDocument, Document>(
        {
          document_name: document.document_name,
          file_path: document.file_path,
          size: document.size,
          mime_type: document.mime_type,
        },
        documentResource.transform,
      );
      return newDocument;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDocumentById(documentId: string) {
    try {
      const document = this.delete(documentId, documentResource.transform);
      return document;
    } catch (error) {
      throw error;
    }
  }
  public async deleteDocumentByFilePath(file_path: string) {
    try {
      await db.document.delete({
        where: {
          file_path: file_path,
        },
      });
      return;
    } catch (error) {
      throw error;
    }
  }
}
