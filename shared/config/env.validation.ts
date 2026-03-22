import { z } from 'zod';

export const adminEnvSchema = z.object({
  ADMIN_DB_HOST: z.string().default('localhost'),
  ADMIN_DB_PORT: z.coerce.number().default(5432),
  ADMIN_DB_USER: z.string().default('postgres'),
  ADMIN_DB_PASSWORD: z.string().default(''),
  ADMIN_DB_NAME: z.string().default('easy_english'),
  ADMIN_DB_SSL: z.string().default('false'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRATION: z.string().default('24h'),
  ADMIN_PORT: z.coerce.number().default(3001),
  GOOGLE_TTS_API_KEY: z.string().default(''),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export const clientEnvSchema = z.object({
  CLIENT_DB_HOST: z.string().default('localhost'),
  CLIENT_DB_PORT: z.coerce.number().default(5432),
  CLIENT_DB_USER: z.string().default('postgres'),
  CLIENT_DB_PASSWORD: z.string().default(''),
  CLIENT_DB_NAME: z.string().default('easy_english'),
  CLIENT_DB_SSL: z.string().default('false'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  CLIENT_PORT: z.coerce.number().default(3000),
  TELEGRAM_BOT_TOKEN: z.string().default(''),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type AdminEnv = z.infer<typeof adminEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function validateAdminEnv(
  config: Record<string, unknown>,
): AdminEnv {
  const result = adminEnvSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Admin env validation failed:\n${errors}`);
  }
  return result.data;
}

export function validateClientEnv(
  config: Record<string, unknown>,
): ClientEnv {
  const result = clientEnvSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Client env validation failed:\n${errors}`);
  }
  return result.data;
}
