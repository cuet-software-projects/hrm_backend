import { IPayroll, PrismaPayrollModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import payrollResource from './payroll.resource';
import { Payroll } from '@prisma/client';
class PayrollCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaPayrollModel[]): IPayroll[] {
    return requestedData.map((payroll) => payrollResource.transform(payroll));
  }
}
const payrollCollection = new PayrollCollection();
export default payrollCollection;
