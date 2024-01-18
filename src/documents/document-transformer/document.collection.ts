import { CollectionTransformer } from '../../core/transformer/transformer';
import { IDocument, PrismaDocumentModel } from '../document.type';
import documentResource from './document.resource';

class DocumentCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaDocumentModel[]): IDocument[] {
    return requestedData.map((document) => documentResource.transform(document));
  }
}

const documentCollection = new DocumentCollection();

export default documentCollection;
