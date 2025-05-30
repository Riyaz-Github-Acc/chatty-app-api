import { Request, Response } from "express";
import { ZodError } from 'zod/v4';

import cloudinary from "../config/cloudinary.config.js";
import { createUser, getUserByEmail, updateUser } from "../services/user.service.js";
import { CreateUserProps, LoginUserProps } from "../types/user.type.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { CreateUserSchema, LoginUserSchema } from "../validators/user.validator.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData: CreateUserProps = CreateUserSchema.parse(req.body);
        const { username, email, password, profilePic } = validatedData;

        const userExists = await getUserByEmail(email)
        if (userExists) {
            res.status(409).json({ success: false, message: 'Email already in use.' })
            return;
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await createUser({ username, email, password: hashedPassword, profilePic: profilePic || '' })
        if (!newUser) {
            res.status(400).json({ success: false, message: 'Error during creating an user.' })
            return;
        }

        generateToken(newUser.id, res);
        res.status(201).json({ success: true, message: 'User created successfully.', record: newUser })
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Signup validation error: ', error.issues);
            res.status(400).json({ success: false, message: error.issues[0].message })
            return;
        }
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData: LoginUserProps = LoginUserSchema.parse(req.body);
        const { email, password } = validatedData;

        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found for this email.' })
            return;
        }

        const { password: hashedPassword, ...userDetails } = user;
        const verifiedPassword = await verifyPassword(password, hashedPassword);
        if (!verifiedPassword) {
            res.status(400).json({ success: false, message: 'Invalid credentials.' })
            return;
        }

        generateToken(user.id, res);
        res.status(200).json({ success: true, message: 'User logged in successful.', record: userDetails });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.error('Login validation error: ', error.issues);
            res.status(400).json({ success: false, message: error.issues[0].message })
            return;
        }
        console.error('Error during login user: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.cookie('auth_token', '', { maxAge: 0 });
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error: unknown) {
        console.error('Error during login user: ', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profilePic } = req.body;
        const userId = req.user?.id
        if (!profilePic) {
            res.status(400).json({ success: false, message: 'Profile picture is required.' })
            return;
        }
        if (!userId) {
            res.status(401).json({ success: false, message: 'User not authenticated.' });
            return;
        }

        const uploadedRes = await cloudinary.uploader.upload(profilePic, { folder: 'chat_app/profile_pics' });
        const updatedUser = await updateUser(userId, uploadedRes.secure_url);
        if (!updatedUser) {
            res.status(400).json({ success: false, message: 'Couldn\'t update the user.' });
            return;
        }

        res.status(200).json({ success: true, message: 'User profile updated successfully.', record: updatedUser })
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

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ success: true, message: 'User details fetched successfully.', record: req.user })
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
