import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
    logger: true,
});

// Declare a route
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
});

fastify.register(cors);

// Run the server!
fastify.listen({ port: 5555 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
