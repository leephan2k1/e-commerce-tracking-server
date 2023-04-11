import cron from 'node-cron';
import {
    notifyPrice,
    cleanupNotifications,
} from '../controllers/product.controller.js';

const tasks = [
    cron.schedule('*0 * * * *', async () => {
        await notifyPrice();
        // eslint-disable-next-line no-console
        console.log('run every 1 hour');
    }),

    cron.schedule('0 1 * * *', async () => {
        await cleanupNotifications();
        // eslint-disable-next-line no-console
        console.log('run every 1 AM');
    }),
];

export default tasks;
