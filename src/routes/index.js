import productRoutes from './product.routes.js';

export default function routes(fastify, options, done) {
    productRoutes.forEach((route) => fastify.route(route));

    done();
}
