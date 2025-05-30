import { and, eq, or } from "drizzle-orm"

import db from "@/db"
import { messagesTable } from "@/db/schemas/message.schema"
import { CreateMessageProps } from "@/types/message.type";

export const getAllMessages = async (loggedInUserId: string, chatUserId: string) => {
    const result = await db.query.messagesTable.findMany({
        where: or(
            and(
                eq(messagesTable.senderId, loggedInUserId),
                eq(messagesTable.receiverId, chatUserId)
            ),
            and(
                eq(messagesTable.senderId, chatUserId),
                eq(messagesTable.receiverId, loggedInUserId)
            )
        ),
        orderBy: (messagesTable.createdAt),
    });

    return result;
}

export const createMessage = async (messageData: CreateMessageProps) => {
    return await db.insert(messagesTable).values(messageData).returning();
}
