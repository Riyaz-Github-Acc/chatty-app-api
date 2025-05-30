import 'dotenv/config';

import { z } from "zod/v4";

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.string().default('5002'),
    DATABASE_URL: z.url(),
    JWT_SECRET_KEY: z.string(),

    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
})

const envConfig = envSchema.parse(process.env)

export default envConfig;
