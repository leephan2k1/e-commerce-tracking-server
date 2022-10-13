import {
    NOTIFY_CHANNEL_PATTERN,
    PRICE_CONDITIONS,
} from '../constants/index.js';

export function validateSubscribePattern(req, rep, next) {
    const { notifyChannel, priceCondition } = req.body;

    if (!NOTIFY_CHANNEL_PATTERN.find((pattern) => pattern === notifyChannel)) {
        return rep.status(400).send({
            status: 'error',
            message: `notifyChannel should be following this pattern: ${NOTIFY_CHANNEL_PATTERN}`,
        });
    }

    if (!PRICE_CONDITIONS.find((condition) => condition === priceCondition)) {
        return rep.status(400).send({
            status: 'error',
            message: `priceCondition should be following this pattern: ${PRICE_CONDITIONS}`,
        });
    }

    next();
}

export function validateProductLink(req, rep, next) {
    const { productLink } = req.query;

    if (!productLink) {
        return rep.status(400).send({
            status: 'error',
            message: 'productLink query should be provided',
        });
    }

    next();
}
