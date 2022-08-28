import { productSearch } from '../controllers/product.controller.js';

const productRoutes = [
    {
        url: '/products/search',
        method: 'GET',
        schema: {
            querystring: {
                keyword: { type: 'string' },
                page: { type: 'number', default: 1 },
                market: { type: 'string', default: 'lazada' },
            },
        },
        handler: productSearch,
    },
];

export default productRoutes;
