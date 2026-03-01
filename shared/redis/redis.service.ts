import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(host: string, port: number, password?: string) {
    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error', err.message);
    });

    this.client.connect().catch((err) => {
      this.logger.error('Redis initial connection failed', err.message);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
