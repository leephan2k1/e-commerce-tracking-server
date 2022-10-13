import axios from 'axios';
import qs from 'fast-querystring';
import { MARKET_MAPPING } from '../constants/index.js';

export function unshiftProtocol(url) {
    return ['http', 'https'].some((protocol) => url.includes(protocol))
        ? url
        : `https:${url}`;
}

export function handlePriceNumber(priceNumber) {
    return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

export function handlePriceShopee(priceNumber) {
    if (!isNaN(priceNumber)) {
        return handlePriceNumber(priceNumber / 100000);
    }

    return '';
}

export function handleSubPathMarket(market, url) {
    if (market !== 'lazada') {
        return url?.replace(`${MARKET_MAPPING[market]}/`, '');
    }

    return url?.replace(`${MARKET_MAPPING[market]}/products/`, '');
}

export function getAxiosClient(referer, origin, baseURL) {
    return axios.create({
        baseURL,
        paramsSerializer: (params) => qs.stringify(params),
        headers: {
            referer,
            origin,
        },
    });
}

export function checkPriceCondition(newPrice, currentPrice, condition) {
    switch (condition) {
        case 'any':
            return newPrice !== currentPrice;
        case 'gt':
            return newPrice > currentPrice;
        case 'lt':
            return newPrice < currentPrice;
    }
}
