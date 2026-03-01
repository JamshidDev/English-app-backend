import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './shared/database/schema/index.ts',
  out: './shared/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://${process.env.ADMIN_DB_USER || 'mack'}:${process.env.ADMIN_DB_PASSWORD || ''}@${process.env.ADMIN_DB_HOST || 'localhost'}:${process.env.ADMIN_DB_PORT || '5432'}/${process.env.ADMIN_DB_NAME || 'easy_english'}`,
  },
});
