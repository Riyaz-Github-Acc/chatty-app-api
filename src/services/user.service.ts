import { eq, ne } from "drizzle-orm"

import db from "../db/index.js";
import { usersTable } from "../db/schemas/user.schema.js";
import { CreateUserProps, UserDetailsProps } from "../types/user.type.js";

const userReturnFields = {
    id: usersTable.id,
    username: usersTable.username,
    email: usersTable.email,
    profilePic: usersTable.profilePic,
    createdAt: usersTable.createdAt,
    updatedAt: usersTable.updatedAt,
}

export const createUser = async (userData: CreateUserProps): Promise<Omit<UserDetailsProps, 'password'>> => {
    const result = await db.insert(usersTable).values(userData).returning(userReturnFields);
    return result[0] || null;
}

export const updateUser = async (userId: string, profilePic: string): Promise<Omit<UserDetailsProps, 'password'> | null> => {
    const result = await db.update(usersTable).set({ profilePic }).where(eq(usersTable.id, userId)).returning(userReturnFields);
    return result[0] || null;
}

export const getUserById = async (userId: string): Promise<Omit<UserDetailsProps, 'password'> | undefined> => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
        columns: { password: false }
    })
}

export const getUserByEmail = async (email: string): Promise<UserDetailsProps | undefined> => {
    return await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });
}

export const getAllUsers = async (loggedInUserId: string): Promise<Omit<UserDetailsProps, 'password'>[] | undefined> => {
    return await db.query.usersTable.findMany({
        where: ne(usersTable.id, loggedInUserId),
        columns: { password: false }
    })
}