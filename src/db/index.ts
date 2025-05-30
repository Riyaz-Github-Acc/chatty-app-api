import { drizzle } from 'drizzle-orm/node-postgres';

import envConfig from '../config/env.config.js';
import { schema } from './schemas/index.js';

const db = drizzle(envConfig.DATABASE_URL, { schema });

export default db;
