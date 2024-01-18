import cron from 'node-cron';
import { db } from '../../db.server';

let jobInstance: cron.CronJob | null = null;

export function startUpdateUserActiveStatusJob() {
  jobInstance = cron.schedule('* * * * *', async () => {
    try {
      const currentDate = new Date();
      const activeLeaves = await db.leave.findMany({
        where: {
          AND: [
            {
              started_at: {
                lte: currentDate,
              },
            },
            {
              ended_at: {
                gte: currentDate,
              },
            },
          ],
        },
      });

      const userIdsOnLeave = [...new Set(activeLeaves.map((leave) => leave.employee_id))];

      await db.user.updateMany({
        where: {
          current_employee_id: {
            in: userIdsOnLeave,
          },
        },
        data: {
          current_status: 'ON_LEAVE',
        },
      });
    } catch (error) {
      console.error('Error updating user statuses:', error);
    }
  });
}

export function stopUpdateUserActiveStatusJob() {
  if (jobInstance) {
    jobInstance.stop();
    console.log('User status update job stopped');
  }
}
