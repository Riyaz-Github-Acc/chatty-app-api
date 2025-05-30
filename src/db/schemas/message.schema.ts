import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "@/db/schemas/user.schema";

export const messagesTable = pgTable("messages", {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    senderId: uuid('sender_id').references(() => usersTable.id).notNull(),
    receiverId: uuid('receiver_id').references(() => usersTable.id).notNull(),
    text: text(),
    image: text(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
