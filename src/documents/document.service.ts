import { DOCUMENT_ASSOCIATION_USER_TYPE } from '@prisma/client';
import DocumentAssociationRepository from '../document-association/document-association.repository';
import DocumentRepository from './document.repository';
import FileUploadService from '../core/services/file-uploader-service/file-upload-service';
import { IDocument } from '../core/types';

export default class DocumentService {
  constructor(
    protected readonly fileService: FileUploadService,
    protected readonly documentAssociationRepo: DocumentAssociationRepository,
    protected readonly documentRepo: DocumentRepository,
  ) {}

  public async createDocument({
    file,
    type,
    type_id,
    notice_id,
  }: {
    file: Express.Multer.File;
    type: DOCUMENT_ASSOCIATION_USER_TYPE;
    type_id?: string;
    notice_id?: string;
  }): Promise<IDocument> {
    try {
      // upload document
      const uploadedFile = await this.fileService.uploadFile(file);
      // create document
      const document = await this.documentRepo.createDocument(uploadedFile);

      // attach the document with user
      await this.documentAssociationRepo.createDocumentAssociation({
        type: type,
        type_id: type_id,
        document_id: document.id,
        notice_id: notice_id,
      });

      return document;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDocument({
    file_path,
    type,
    type_id,
  }: {
    file_path: string;
    type: DOCUMENT_ASSOCIATION_USER_TYPE;
    type_id?: string;
  }): Promise<void> {
    try {
      // delete document attachment relation
      await this.documentAssociationRepo.deleteDocumentAssociations({
        type: type,
        type_id: type_id,
        file_path: file_path,
      });
      // delete document
      await this.documentRepo.deleteDocumentByFilePath(file_path);

      // delete file
      await this.fileService.deleteFile(file_path);
    } catch (error) {
      throw error;
    }
  }
}
