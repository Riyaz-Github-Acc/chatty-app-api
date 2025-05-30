import { NextFunction, Request, Response } from "express";

import { getUserById } from "../services/user.service.js";
import { verifyToken } from "../utils/jwt.js";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { auth_token } = req.cookies;
        if (!auth_token) {
            res.status(401).json({ success: false, message: 'Auth token is not found.' });
            return;
        }

        const verifiedToken = verifyToken(auth_token);
        if (!verifiedToken) {
            res.status(401).json({ success: false, message: 'Auth token is not valid.' });
            return;
        }

        const user = await getUserById(verifiedToken.userId)
        if (!user) {
            res.status(404).json({ success: false, message: 'User details not found.' });
            return;
        }

        req.user = user;
        next();
    } catch (error: unknown) {
        console.error('Error in protected route middleware: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}