import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PORT } from './configs/index.js';
import routes from './routes/index.js';

const fastify = Fastify();

fastify.register(routes, { prefix: '/api/v1' });

fastify.register(cors);

(async function () {
    try {
        await fastify.ready();

        const address = await fastify.listen({ port: PORT, host: '0.0.0.0' });
        // eslint-disable-next-line no-console
        console.log(`Server listening at ${address}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
})();
