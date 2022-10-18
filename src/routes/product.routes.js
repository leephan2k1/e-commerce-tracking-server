import {
    generateProductLink,
    getProductVotes,
    productSearch,
    getRecentlyVotes,
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

    {
        url: '/products/recently-vote',
        method: 'GET',
        schema: {
            querystring: {
                limit: { type: 'number', default: 10 },
            },
        },
        handler: getRecentlyVotes,
    },

    {
        url: '/products/generate-link',
        method: 'GET',
        schema: {
            querystring: {
                market: { type: 'string' },
                productLink: { type: 'string' },
            },
        },
        handler: generateProductLink,
    },
];

export default productRoutes;
