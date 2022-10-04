import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
dotenv.config();

export const TIKI_URL = 'https://tiki.vn';
export const SHOPEE_URL = 'https://shopee.vn';
export const LAZADA_URL = 'https://www.lazada.vn';

export const BC_API = process.env.BC_API_ENDPOINT;
export const BC_URL = process.env.BC_URL;

const environment = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI;

export const mongoDbRemoteClient = mongoose.createConnection(MONGODB_URI, {
    dbName: `real-cost-${environment === 'development' ? 'dev' : 'production'}`,
});

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
