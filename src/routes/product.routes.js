import {
    productSearch,
    getProductVotes,
} from '../controllers/product.controller.js';

const productRoutes = [
    {
        url: '/products/search',
        method: 'GET',
        schema: {
            querystring: {
                keyword: { type: 'string' },
                page: { type: 'number', default: 1 },
                limit: { type: 'number', default: 24 },
                market: { type: 'string', default: 'lazada' },
                searchType: { type: 'string' },
            },
        },
        handler: productSearch,
    },

    {
        url: '/products/votes',
        method: 'GET',
        handler: getProductVotes,
    },
];

export default productRoutes;
