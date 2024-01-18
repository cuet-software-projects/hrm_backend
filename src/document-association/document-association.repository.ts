import { DOCUMENT_ASSOCIATION_USER_TYPE } from '@prisma/client';
import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
export default class DocumentAssociationRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Document_Association');
  }

  public async createDocumentAssociation({
    type,
    type_id,
    document_id,
    notice_id,
  }: {
    type: DOCUMENT_ASSOCIATION_USER_TYPE;
    type_id: string;
    document_id: string;
    notice_id?: string;
  }) {
    try {
      const newDocumentAssociation = await db.document_Association.create({
        data: {
          type: type,
          type_id: type_id,
          document_id: document_id,
          notice_id: notice_id,
        },
      });
      return newDocumentAssociation;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDocumentAssociations({
    type,
    type_id,
    file_path,
  }: {
    type: DOCUMENT_ASSOCIATION_USER_TYPE;
    type_id: string;
    file_path: string;
  }) {
    try {
      await db.document_Association.deleteMany({
        where: {
          type: type,
          type_id: type_id,
          document: {
            file_path: file_path,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findDocumentAssociationByUserType({ user_id }: { user_id: string }) {
    try {
      const documentAssociations = await db.document_Association.findMany({
        where: {
          type_id: user_id,
          type: 'USER',
        },
      });
      return documentAssociations;
    } catch (error) {
      throw error;
    }
  }

  public async findDocumentAssociationByEmployeeType({
    employee_info_id,
  }: {
    employee_info_id: string;
  }) {
    try {
      const documentAssociations = await db.document_Association.findMany({
        where: {
          type_id: employee_info_id,
          type: 'EMPLOYEE',
        },
      });
      return documentAssociations;
    } catch (error) {
      throw error;
    }
  }
}
