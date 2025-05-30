import { InferSelectModel } from "drizzle-orm";
import { z } from "zod/v4"

import { usersTable } from "@/db/schemas/user.schema";
import { CreateUserSchema, LoginUserSchema } from "@/validators/user.validator";

export type CreateUserProps = z.infer<typeof CreateUserSchema>;
export type LoginUserProps = z.infer<typeof LoginUserSchema>;
export type UserDetailsProps = InferSelectModel<typeof usersTable>;
