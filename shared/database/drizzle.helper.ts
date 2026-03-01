import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from './schema';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export const DRIZZLE = Symbol('DRIZZLE');

export interface DbConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
  max?: number;
}

export function createDrizzleConnection(config: DbConnectionConfig): DrizzleDB {
  const poolConfig: PoolConfig = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    max: config.max ?? 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (config.ssl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  return drizzle(pool, { schema });
}
