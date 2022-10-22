import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
dotenv.config();

export const TIKI_URL = 'https://tiki.vn';
export const SHOPEE_URL = 'https://shopee.vn';
export const LAZADA_URL = 'https://www.lazada.vn';

export const TIKI_AF_TOKEN = process.env.TIKI_TOKEN;
export const TIKI_OWNER_ID = process.env.TIKI_OWNER_ID;

export const SP_COOKIE = JSON.parse(process.env.SP_COOKIE)?.cookie;

export const BC_API = process.env.BC_API_ENDPOINT;
export const BC_URL = process.env.BC_URL;

// nodemailer config
export const nodemailerConfig = process.env.NODEMAILER_CONFIG
    ? JSON.parse(process.env.NODEMAILER_CONFIG)
    : {};

// web push configs:
export const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
export const privateVapidKey = process.env.SECRET_VAPID_KEY;

export const WEB_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const SERVER_DOMAIN =
    process.env.SERVER_DOMAIN || 'http://localhost:5555';

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
