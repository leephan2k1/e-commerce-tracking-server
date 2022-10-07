import {
    saveFavoriteProduct,
    deleteFavoriteProduct,
    getFavoriteInfo,
    getDetailFavoritesInfo,
    handleVoteProduct,
    handleRemoveVoteProduct,
} from '../controllers/user.controller.js';
import { validateUserId } from '../middlewares/validateUser.js';

const productRoutes = [
    {
        url: '/users/:userId/get-favorite',
        method: 'POST',
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
        handler: getFavoriteInfo,
    },

    {
        url: '/users/:userId/votes',
        method: 'POST',
        schema: {
            body: { $ref: 'productBodySchema#' },
            querystring: {
                voteType: { type: 'string' },
            },
        },
        preHandler: [validateUserId],
        handler: handleVoteProduct,
    },

    {
        url: '/users/:userId/votes',
        method: 'DELETE',
        schema: {
            body: { $ref: 'productBodySchema#' },
            querystring: {
                voteType: { type: 'string' },
            },
        },
        preHandler: [validateUserId],
        handler: handleRemoveVoteProduct,
    },

    {
        url: '/users/:userId/favorite',
        method: 'GET',
        handler: getDetailFavoritesInfo,
    },

    {
        url: '/users/:userId/favorite',
        method: 'POST',
        schema: {
            body: { $ref: 'productBodySchema#' },
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
