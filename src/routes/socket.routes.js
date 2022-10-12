import {
    setSocketId,
    removeSocketId,
} from '../controllers/socket.controller.js';

export default function socketRoute(fastify) {
    fastify.io.on('connection', (socket) => {
        socket.on('online-emitter', (data) => {
            setSocketId(data.userId, socket.id);
        });

        socket.on('disconnect', () => {
            removeSocketId(socket.id);
        });
    });
}
