import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';

const notificationSchema = {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true,
        index: true,
    },
    productLink: { type: String, index: true, require: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', require: true },
    seen: { type: Date },
};

const NotificationSchema = new Schema(notificationSchema, { timestamps: true });

export default mongoDbRemoteClient.model('notifications', NotificationSchema);
