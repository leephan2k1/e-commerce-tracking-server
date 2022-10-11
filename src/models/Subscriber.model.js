import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';

const subscriberSchema = {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        index: true,
        require: true,
    },
    notifyChannel: { type: String, require: true },
    productLink: { type: String, index: true },
    priceCondition: { type: String, require: true },
    priceAtSubscribe: { type: Number, require: true },
};

const SubscriberSchema = new Schema(subscriberSchema, { timestamps: true });

export default mongoDbRemoteClient.model('subscribers', SubscriberSchema);
