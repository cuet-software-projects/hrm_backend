import { Router, Request, Response } from 'express';
import departmentRouter from '../departments/department.route';
import teamRouter from '../teams/team.route';
import branchRouter from '../branches/branch.route';
import userRouter from '../users/users.route';
import employeeRouter from '../employee-info/employee.route';
import designationRouter from '../designations/designation.route';
import attendanceRouter from '../attendances/attendance.route';
import authRouter from '../auth/auth.route';
import payrollRoute from '../payrolls/payroll.route';
import bonusRoute from '../bonuses/bonus.route';
import { verifyToken } from '../auth/auth';
import meRouter from './me.route';
import catchAsync from '../utils/catchAsync';
import MailService from '../external/Mail';
import roleRouter from '../roles/roles.route';
import leaveRoute from '../leaves/leave.route';
import S3Service from '../external/S3';
import multer from 'multer';
import eventRouter from '../event/events.route';
import feedbackRoute from '../feedbacks/feedback.route';
import salaryCertificateRouter from '../salary-certificates/salary-certificate.route';
import userSocialMediaRouter from '../user-social-medias/user-social-media.route';
import invoiceRouter from '../invoices/invoice.route';
import billingInfoRouter from '../billing-info/billing-info.route';
import noticeRouter from '../notices/notice.route';

const storage = multer.memoryStorage(); // Using memory storage for simplicity
const upload = multer({ storage });

const router = Router();

type RouterType = {
  route: Router;
  path?: string;
  verificationDesabled?: boolean;
};

const defaultRoutes: RouterType[] = [
  {
    path: '/auth',
    route: authRouter,
    verificationDesabled: true,
  },
  {
    path: '/invoices',
    route: invoiceRouter,
  },
  {
    route: billingInfoRouter,
  },
  {
    route: departmentRouter,
  },
  {
    route: teamRouter,
  },
  {
    route: branchRouter,
  },
  {
    route: userRouter,
  },
  {
    route: payrollRoute,
    path: '/employees',
  },
  {
    route: leaveRoute,
    path: '/employees',
  },
  {
    route: bonusRoute,
    path: '/employees',
  },
  {
    route: attendanceRouter,
    path: '/employees',
  },
  {
    route: employeeRouter,
  },
  {
    route: designationRouter,
  },
  {
    route: meRouter,
  },
  {
    route: roleRouter,
  },
  {
    route: eventRouter,
  },
  {
    route: feedbackRoute,
  },
  {
    path: '/salary-certificates',
    route: salaryCertificateRouter,
  },
  {
    route: userSocialMediaRouter,
  },
  {
    path: '/notices',
    route: noticeRouter,
  },
];

router.post(
  '/upload',
  upload.single('file'),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileUrl = await new S3Service().uploadFile(file);
      const fileData = {
        filename: file.originalname,
        url: fileUrl,
      };
      res.send(fileData);
      return '';
    } catch (error) {
      throw error;
    }
  }),
);
router.get('', (req, res) => {
  res.send('<h1>hi</h1>');
});

defaultRoutes.forEach((route) => {
  if (route?.path) {
    if (route.verificationDesabled) {
      router.use(route.path, route.route);
    } else {
      router.use(route.path, verifyToken, route.route);
    }
  } else {
    if (route.verificationDesabled) {
      router.use(route.route);
    } else {
      router.use(verifyToken, route.route);
    }
  }
});

router.get(
  '/mail-test',
  catchAsync(async (req, res) => {
    await new MailService().sendUserUpdatedItem('a@gmail.com', null);
    res.send('<h1>hi</h1>');
  }),
);

export default router;
