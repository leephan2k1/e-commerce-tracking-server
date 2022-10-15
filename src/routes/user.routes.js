import {
    saveFavoriteProduct,
    deleteFavoriteProduct,
    getFavoriteInfo,
    getDetailFavoritesInfo,
    handleVoteProduct,
    handleRemoveVoteProduct,
    handleSubscribeToNotifyProduct,
    getInfoSubscriber,
    handleDeleteSubscriber,
    getNotifications,
    deleteNotification,
} from '../controllers/user.controller.js';
import { validateUserId } from '../middlewares/validateUser.js';
import {
    validateSubscribePattern,
    validateProductLink,
} from '../middlewares/validateSubscribe.js';

const userRoutes = [
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
        url: '/users/:userId/notifications',
        method: 'GET',
        preHandler: [validateUserId],
        handler: getNotifications,
    },

    {
        url: '/users/:userId/notifications',
        method: 'DELETE',
        schema: {
            querystring: {
                productLink: { type: 'string' },
            },
        },
        preHandler: [validateUserId],
        handler: deleteNotification,
    },

    {
        url: '/users/:userId/subscribe',
        method: 'GET',
        schema: {
            querystring: {
                productLink: { type: 'string' },
            },
        },
        preHandler: [validateUserId, validateProductLink],
        handler: getInfoSubscriber,
    },

    {
        url: '/users/:userId/subscribe',
        method: 'DELETE',
        schema: {
            querystring: {
                productLink: { type: 'string' },
            },
        },
        preHandler: [validateUserId, validateProductLink],
        handler: handleDeleteSubscriber,
    },

    {
        url: '/users/:userId/subscribe',
        method: 'POST',
        schema: {
            body: { $ref: 'subscribeBodySchema#' },
        },
        preHandler: [validateUserId, validateSubscribePattern],
        handler: handleSubscribeToNotifyProduct,
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

export default userRoutes;
