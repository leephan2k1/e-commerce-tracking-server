import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';

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
    priceBeforeDiscount: { type: Number },
    discountPercent: { type: Number },
    qtyRemainPercent: { type: Number },
};

const ProductSchema = new Schema(productSchema);

export default mongoDbRemoteClient.model('products', ProductSchema);
