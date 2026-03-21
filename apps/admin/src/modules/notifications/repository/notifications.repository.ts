import { Injectable, Inject } from '@nestjs/common';
import { desc, count } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { notifications } from '@shared/database/schema';

@Injectable()
export class AdminNotificationsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: {
    clientId?: string;
    title: string;
    message: string;
    type: string;
    source: string;
  }) {
    const [result] = await this.db
      .insert(notifications)
      .values(data)
      .returning();
    return result;
  }

  async findAll(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(pageSize)
      .offset(offset);
  }

  async countAll() {
    const [result] = await this.db
      .select({ total: count() })
      .from(notifications);
    return Number(result.total);
  }
}
