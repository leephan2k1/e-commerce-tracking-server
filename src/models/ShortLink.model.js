import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';

const shortLinkSchema = {
    productLink: { type: String, index: true, unique: true, require: true },
    shortLink: { type: String, require: true },
    market: { type: String },
};

const ShortLink = new Schema(shortLinkSchema, { timestamps: true });

export default mongoDbRemoteClient.model('shortlinks', ShortLink);
