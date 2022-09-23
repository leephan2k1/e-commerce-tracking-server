import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
dotenv.config();

export const TIKI_URL = 'https://tiki.vn';
export const SHOPEE_URL = 'https://shopee.vn';
export const LAZADA_URL = 'https://www.lazada.vn';
export const BC_API = process.env.BC_API_ENDPOINT;
export const BC_URL = process.env.BC_URL;

export const mongoDbRemoteClient = mongoose.createConnection(
    'mongodb://localhost:27017',
    {
        dbName: 'real-cost-database',
    },
);

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
