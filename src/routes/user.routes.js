import { saveFavoriteProduct } from '../controllers/user.controller.js';
import { validateUserId } from '../middlewares/validateUser.js';

const productRoutes = [
    {
        url: '/users/:userId/favorite',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                required: ['name', 'link', 'img', 'price', 'market'],
                properties: {
                    name: { type: 'string' },
                    link: { type: 'string' },
                    market: { type: 'string' },
                    img: { type: 'string' },
                    price: { type: 'string' },
                    totalSales: { type: 'string' },
                },
            },
        },
        preHandler: [validateUserId],
        handler: saveFavoriteProduct,
    },
];

export default productRoutes;
