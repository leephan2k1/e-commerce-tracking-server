import mongoose from 'mongoose';
const { Schema } = mongoose;
import { mongoDbRemoteClient } from '../configs/index.js';

const userSchema = {
    name: { type: String },
    email: { type: String },
    image: { type: String },
    favorite_products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
};

const UserSchema = new Schema(userSchema);

export default mongoDbRemoteClient.model('users', UserSchema);
