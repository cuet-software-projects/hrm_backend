import MailService from '../../external/Mail';
import S3Service from '../../external/S3';
import AttendanceRepository from '../../attendances/attendance.repository';
import BillingInfoRepository from '../../billing-info/billing-info.repository';
import BonusRepository from '../../bonuses/bonus.repository';
import BranchRepository from '../../branches/branch.repository';
import DepartmentRepository from '../../departments/department.repository';
import DesignationRepository from '../../designations/designation.repository';
import DocumentAssociationRepository from '../../document-association/document-association.repository';
import DocumentRepository from '../../documents/document.repository';
import EmployeeDesignationSalaryRepository from '../../employee-designaiton-salaries/employee-designation-salary.repository';
import EmployeeRepository from '../../employee-info/employee.repository';
import FeedbackRepository from '../../feedbacks/feedback.repository';
import InvoiceRepository from '../../invoices/invoice.repository';
import LeaveRepository from '../../leaves/leave.repository';
import PayrollRepository from '../../payrolls/payroll.repository';
import RoleRepository from '../../roles/role.repository';
import SalaryCertificateRepository from '../../salary-certificates/salary-certificate.repository';
import TeamRepository from '../../teams/team.repository';
import UserNotificationPreferenceRepository from '../../user-notifications/user-notification.repository';
import UserRoleRepository from '../../user-roles/user-role.repository';
import UserSocialMediaRepository from '../../user-social-medias/user-social-media.repository';
import UserRepository from '../../users/user.repository';
import AttendanceService from '../../attendances/attendance.service';
import AuthService from '../../auth/auth.services';
import BcryptService from '../services/bcrypt.service';
import BillingInfoService from '../../billing-info/billing-info.service';
import BonusService from '../../bonuses/bonus.service';
import BranchService from '../../branches/branch.service';
import DepartmentService from '../../departments/department.service';
import DesignationService from '../../designations/designation.service';
import DocumentService from '../../documents/document.service';
import EmployeeService from '../../employee-info/employee.service';
import EventService from '../../event/event.service';
import FeedbackService from '../../feedbacks/feedback.service';
import FileUploadService from '../services/file-uploader-service/file-upload-service';
import InvoiceService from '../../invoices/invoice.service';
import LeaveService from '../../leaves/leave.service';
import NotificationPreferences from '../services/notificaiton-service/notification-preferences';
import NotificationService from '../services/notificaiton-service/notificationService';
import PayrollService from '../../payrolls/payroll.service';
import RoleService from '../../roles/role.service';
import SalaryCertificateService from '../../salary-certificates/salary.certificate.service';
import TeamService from '../../teams/team.service';
import TokenServices from '../services/token.service';
import UserSocialMediaService from '../../user-social-medias/user-social-media.service';
import UserService from '../../users/user.service';
import NoticeService from '../../notices/notice.service';
import NoticeRepository from '../../notices/notice.repository';
import ForgotPasswordRepository from '../../auth/forgot-password.repository';
import NoticeRecipientRepository from '../../notices/noticeRecipient.repository';
import BaseService from '../services/base.service';

export const authService = new AuthService(
  new TokenServices(),
  new UserRepository(new BaseService()),
  new ForgotPasswordRepository(),
  new BcryptService(),
  new MailService(),
);

export const salaryCertificateService = new SalaryCertificateService(
  new SalaryCertificateRepository(),
  new UserRepository(new BaseService()),
);

export const userSocialMediaService = new UserSocialMediaService(
  new UserSocialMediaRepository(),
  new UserRepository(new BaseService()),
);

export const eventService = new EventService(new UserRepository(new BaseService()));

export const notificationService = new NotificationService(
  new MailService(),
  new NotificationPreferences(),
);

export const employeeService = new EmployeeService(
  new UserRepository(new BaseService()),
  new EmployeeRepository(),
  new BranchRepository(),
  new AttendanceRepository(),
  new DepartmentRepository(),
  new EmployeeDesignationSalaryRepository(),
  notificationService,
);

export const documentService = new DocumentService(
  new FileUploadService(new S3Service()),
  new DocumentAssociationRepository(),
  new DocumentRepository(),
);

export const userService = new UserService(
  new UserRepository(new BaseService()),
  new BcryptService(),
  new UserRoleRepository(),
  new UserNotificationPreferenceRepository(),
  notificationService,
  documentService,
);

export const teamService = new TeamService(new TeamRepository());

export const roleService = new RoleService(new RoleRepository());

export const payrollService = new PayrollService(
  new PayrollRepository(),
  new BonusRepository(),
  new EmployeeService(
    new UserRepository(new BaseService()),
    new EmployeeRepository(),
    new BranchRepository(),
    new AttendanceRepository(),
    new DepartmentRepository(),
    new EmployeeDesignationSalaryRepository(),
    notificationService,
  ),
);

export const designationService = new DesignationService(new DesignationRepository());

export const branchService = new BranchService(new BranchRepository());

export const departmentService = new DepartmentService(new DepartmentRepository());
export const attendanceService = new AttendanceService(new AttendanceRepository());

export const bonusService = new BonusService(new BonusRepository(), employeeService);

export const leaveService = new LeaveService(
  new LeaveRepository(),
  new EmployeeService(
    new UserRepository(new BaseService()),
    new EmployeeRepository(),
    new BranchRepository(),
    new AttendanceRepository(),
    new DepartmentRepository(),
    new EmployeeDesignationSalaryRepository(),
    notificationService,
  ),
);

export const feedbackService = new FeedbackService(new FeedbackRepository());
export const invoiceService = new InvoiceService(new InvoiceRepository());
export const billingInfoService = new BillingInfoService(new BillingInfoRepository());
export const noticeService = new NoticeService(
  new NoticeRepository(),
  new NoticeRecipientRepository(),
);
