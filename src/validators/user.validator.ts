import { z } from "zod/v4";

export const CreateUserSchema = z.strictObject({
    username: z.string()
        .min(1, { error: "Username is required." })
        .min(3, { error: "Username must be at least 3 characters long." })
        .max(50, { error: "Username cannot exceed 50 characters." })
        .trim(),

    email: z.email({ error: "Invalid email address format." })
        .min(1, { error: "Email is required." })
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, { error: "Password is required." })
        .min(8, { error: "Password must be at least 8 characters long." })
        .max(100, { error: "Password cannot exceed 100 characters." })
        .trim(),

    profilePic: z.url({ error: "Profile picture URL is invalid." })
        .trim()
        .default("")
        .optional()
});

export const LoginUserSchema = z.strictObject({
    email: z.email()
        .min(1, { error: "Email is required." })
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, { error: "Password is required." })
        .min(8, { error: "Password must be at least 8 characters long." })
        .max(100, { error: "Password cannot exceed 100 characters." })
        .trim(),
})