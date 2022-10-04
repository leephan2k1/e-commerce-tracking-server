import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';

export default function routes(fastify, options, done) {
    productRoutes.forEach((route) => fastify.route(route));

    userRoutes.forEach((route) => fastify.route(route));

    done();
}
