import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';
import { getProductDetails as tikiGetProductDetails } from '../models/Tiki.model.js';
import { getProductDetails as bcGetProductDetails } from '../models/Bc.model.js';

const productSchema = {
    name: { type: String, trim: true, require: true },
    link: {
        type: String,
        unique: true,
        index: true,
        require: true,
        trim: true,
    },
    product_base_id: { type: String },

    market: { type: String, require: true },
    img: { type: String, require: true },
    price: { type: String, require: true },
    totalSales: { type: String },

    up_votes: [{ type: Schema.Types.ObjectId }],
    down_votes: [{ type: Schema.Types.ObjectId }],
    subscribers: [{ type: Schema.Types.ObjectId, ref: 'subscribers' }],

    priceBeforeDiscount: { type: Number },
    discountPercent: { type: Number },
    qtyRemainPercent: { type: Number },
};

const ProductSchema = new Schema(productSchema, { timestamps: true });

export default mongoDbRemoteClient.model('products', ProductSchema);

export async function getProductDetails(market, url) {
    if (market === 'tiki') {
        return await tikiGetProductDetails(url);
    }

    return await bcGetProductDetails(market, url);
}
