import { defineConfig } from 'drizzle-kit';

import envConfig from './src/config/env.config.js';

export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schemas',
    dialect: 'postgresql',
    dbCredentials: {
        url: envConfig.DATABASE_URL,
    },
});
