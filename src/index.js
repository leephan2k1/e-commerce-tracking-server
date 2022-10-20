import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
    PORT,
    publicVapidKey,
    privateVapidKey,
    SERVER_DOMAIN,
} from './configs/index.js';
import routes from './routes/index.js';
import helmet from '@fastify/helmet';
import { bodySchema } from './schema/index.js';
import FastifyWs from 'fastify-socket.io';
import tasks from './services/cron.service.js';
import socketRoute from './routes/socket.routes.js';
import webPush from 'web-push';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import swaggerDocs from './swagger.js';

const fastify = Fastify();

fastify.register(cors, {
    origin: ['http://localhost:3000', 'https://realcost.shop'],
});

fastify.register(fastifySwagger, swaggerDocs);

fastify.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
});

fastify.register(helmet);

fastify.register(FastifyWs, { cors: { origin: '*' } });

fastify.register(routes, { prefix: '/api/v1' });

bodySchema.forEach((schema) => fastify.addSchema(schema));

webPush.setVapidDetails(SERVER_DOMAIN, publicVapidKey, privateVapidKey);

(async function () {
    try {
        await fastify.ready();

        fastify.swagger();

        // run cron-job task:
        tasks.forEach((task) => task.start());

        socketRoute(fastify);

        const address = await fastify.listen({ port: PORT });
        // eslint-disable-next-line no-console
        console.log(`Server listening at ${address}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
})();

export default fastify;
