import {
  ISalaryCertificate,
  PrismaSalaryCertificateModel,
} from '../salary-certificate.type';
import { Transformer } from '../../core/transformer/transformer';
import userResource from '../../users/user-transformer/user.resource';

class SalaryCertificateResource implements Transformer {
  transform(salaryCertificate: PrismaSalaryCertificateModel): ISalaryCertificate {
    return {
      id: salaryCertificate.id,
      created_at: salaryCertificate.created_at.toISOString(),
      updated_at: salaryCertificate.updated_at.toISOString(),
      reason: salaryCertificate.reason,
      issue_date: salaryCertificate.issue_date.toISOString(),
      user_id: salaryCertificate.user_id,
      user: salaryCertificate.user
        ? userResource.transform(salaryCertificate.user)
        : null,
      status: salaryCertificate.status,
      current_salary: salaryCertificate.current_salary,
      current_designation: salaryCertificate.current_designation,
    };
  }
}
const salaryCertificateResource = new SalaryCertificateResource();
export default salaryCertificateResource;
