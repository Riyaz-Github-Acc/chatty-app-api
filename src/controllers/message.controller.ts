import { Request, Response } from "express";
import { ZodError } from 'zod/v4';

import cloudinary from "../config/cloudinary.config.js";
import { getReceiverSocketId, io } from "../config/socket.config.js";
import { createMessage, getAllMessages } from "../services/message.service.js";
import { getAllUsers } from "../services/user.service.js";
import { CreateMessageSchema } from "../validators/message.validator.js";


export const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
    try {
        const loggedInUserId = req.user?.id;
        const users = await getAllUsers(loggedInUserId as string);
        res.status(200).json({ success: true, message: 'User details fetched successfully.', record: users })
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Update validation error: ', error.issues);
            res.status(400).json({ success: false, message: error.issues[0].message })
            return;
        }
        console.error('Error during updating user: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { chatUserId } = req.params;
        const loggedInUserId = req.user?.id;

        const messages = await getAllMessages(loggedInUserId as string, chatUserId);
        res.status(200).json({ success: true, message: 'Messages fetched successfully.', record: messages });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Update validation error: ', error.issues);
            res.status(400).json({ success: false, message: error.issues[0].message })
            return;
        }
        console.error('Error during updating user: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

export const postMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const senderId = req.user?.id as string;
        const { receiverId } = req.params;

        if (!senderId) {
            res.status(401).json({ success: false, message: 'User not authenticated.' });
            return;
        }
        if (!receiverId) {
            res.status(401).json({ success: false, message: 'Receiver id is required.' });
            return;
        }

        const { text, image } = req.body;
        if (!text && !image) {
            res.status(400).json({ success: false, message: 'Message should contain either text or image.' })
            return;
        }

        let imageUrl: string | null = null;
        if (image) {
            const uploadedRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadedRes.secure_url;
        };

        const messageData = {
            senderId,
            receiverId,
            text: text || null,
            image: imageUrl,
        }

        const validatedData = CreateMessageSchema.parse(messageData)
        const [newMessage] = await createMessage(validatedData);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            console.log(newMessage, 'nwe')
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.status(201).json({ success: true, message: 'Message sent successfully.', record: newMessage })
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Update validation error: ', error.issues);
            res.status(400).json({ success: false, message: error.issues[0].message })
            return;
        }
        console.error('Error during updating user: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}


