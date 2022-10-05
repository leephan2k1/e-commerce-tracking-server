import {
    saveFavoriteProduct,
    deleteFavoriteProduct,
} from '../controllers/user.controller.js';
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

    {
        url: '/users/:userId/favorite',
        method: 'DELETE',
        schema: {
            body: {
                type: 'object',
                required: ['link'],
                properties: {
                    link: { type: 'string' },
                },
            },
        },
        preHandler: [validateUserId],
        handler: deleteFavoriteProduct,
    },
];

export default productRoutes;
