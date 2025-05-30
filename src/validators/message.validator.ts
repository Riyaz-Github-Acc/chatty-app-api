import { z } from "zod/v4";

export const CreateMessageSchema = z.strictObject({
    senderId: z.uuid({ error: 'Invalid sender ID' }).trim(),
    receiverId: z.uuid({ error: 'Invalid receiver ID' }).trim(),
    text: z.string().trim().nullable().optional(),
    image: z.url({ error: "Image URL is invalid." }).trim().nullable().optional()
}).refine(
    (data) => data.text || data.image,
    { error: "Either text or image must be provided" }
);
