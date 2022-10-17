import cron from 'node-cron';
import { notifyPrice } from '../controllers/product.controller.js';

const tasks = [
    cron.schedule('*/10 * * * *', async () => {
        await notifyPrice();
        // eslint-disable-next-line no-console
        console.log('run every 10 minutes');
    }),
];

export default tasks;
