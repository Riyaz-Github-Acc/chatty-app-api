import { drizzle } from 'drizzle-orm/node-postgres';

import envConfig from '@/config/env.config';

import { schema } from './schemas';

const db = drizzle(envConfig.DATABASE_URL, { schema });

export default db;
