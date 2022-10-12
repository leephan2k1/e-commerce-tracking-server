import User from '../models/User.model.js';

export async function setSocketId(userId, socketId) {
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { socketIds: socketId },
        });

        if (!user) {
            console.error('update socket ERROR:: ');
        }
    } catch (error) {
        console.error('setSocketId ERROR:: ', error);
    }
}

export async function removeSocketId(socketId) {
    try {
        const user = await User.findOneAndUpdate(
            {
                socketIds: { $in: [socketId] },
            },
            { $pull: { socketIds: socketId } },
        );

        if (!user) {
            console.error('remove socket ERROR:: ');
        }
    } catch (error) {
        console.error('setSocketId ERROR:: ', error);
    }
}
