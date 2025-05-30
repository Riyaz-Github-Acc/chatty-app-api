import 'dotenv/config';

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express';
import path from 'path';

import envConfig from '@/config/env.config';
import { app, server } from '@/config/socket.config';
import authRoutes from '@/routes/auth.route';
import messageRoutes from '@/routes/message.route';

const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (envConfig.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

server.listen(envConfig.PORT, () => {
    console.log(`💻 Server started to run on the port: ${envConfig.PORT}`);
});