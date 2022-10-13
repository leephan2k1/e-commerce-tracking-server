import cron from 'node-cron';

const tasks = [
    cron.schedule('*/1 * * * *', () => {
        console.log('run every 1 minutes');
    }),
];

export default tasks;
