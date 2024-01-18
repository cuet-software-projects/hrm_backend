import { Document } from '@prisma/client';
import { IDocument } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import dayjs from 'dayjs';

class DocumentResource implements Transformer {
  transform(document: Document): IDocument {
    return {
      id: document?.id,
      document_name: document?.document_name,
      mime_type: document.mime_type,
      size: document.size,
      file_path: document.file_path,
      created_at: dayjs(document.created_at).toISOString(),
      updated_at: dayjs(document.updated_at).toISOString(),
    };
  }
}

const documentResource = new DocumentResource();

export default documentResource;
