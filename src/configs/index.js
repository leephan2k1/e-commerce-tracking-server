import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export const TIKI_URL = 'https://tiki.vn';
export const SHOPEE_URL = 'https://shopee.vn';
export const LAZADA_URL = 'https://www.lazada.vn';

export function getAxiosClient(referer, origin) {
    const configs = {
        headers: {
            referer: referer,
            origin: origin,
        },
    };

    return axios.create(configs);
}

export const PORT = process.env.PORT || 5555;
