import { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import envConfig from '../config/env.config.js';

export const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, envConfig.JWT_SECRET_KEY, { expiresIn: '1d' });
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: envConfig.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
}

export const verifyToken = (token: string) => {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET_KEY);
    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload: expected object.')
    }
    return decoded as JwtPayload & { userId: string };
} 