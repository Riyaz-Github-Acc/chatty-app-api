import express from 'express';
import http from 'http'
import { Server } from 'socket.io';

import { UserSocketMapProps } from '../types/socket.type.js';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

const userSocketMap: UserSocketMapProps = {};

io.on('connection', (socket) => {
    console.log(`User connect to the chat: ${socket.id}`);

    const rawUserId = socket.handshake.query?.userId
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
        io.emit('onlineUsers', Object.keys(userSocketMap));
    }

    socket.on('disconnect', () => {
        console.log(`User disconnected from the chat: ${socket.id}`)

        if (typeof userId === 'string') {
            delete userSocketMap[userId]
            io.emit('onlineUsers', Object.keys(userSocketMap))
        }
    })
});

export const getReceiverSocketId = (userId: string) => {
    return userSocketMap[userId];
}

export { app, io, server }