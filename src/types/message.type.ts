import { InferSelectModel } from "drizzle-orm";
import { z } from "zod/v4";

import { messagesTable } from "../db/schemas/message.schema";
import { CreateMessageSchema } from "../validators/message.validator";

export type CreateMessageProps = z.infer<typeof CreateMessageSchema>
export type MessageDetailsProps = InferSelectModel<typeof messagesTable>;