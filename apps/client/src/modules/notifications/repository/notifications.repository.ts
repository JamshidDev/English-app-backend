import { Injectable, Inject } from '@nestjs/common';
import { eq, and, or, isNull, desc, count, sql } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { notifications } from '@shared/database/schema';

@Injectable()
export class ClientNotificationsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByClient(clientId: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.db
      .select()
      .from(notifications)
      .where(or(eq(notifications.clientId, clientId), isNull(notifications.clientId)))
      .orderBy(desc(notifications.createdAt))
      .limit(pageSize)
      .offset(offset);
  }

  async countByClient(clientId: string) {
    const [result] = await this.db
      .select({ total: count() })
      .from(notifications)
      .where(or(eq(notifications.clientId, clientId), isNull(notifications.clientId)));
    return Number(result.total);
  }

  async countUnread(clientId: string) {
    const [result] = await this.db
      .select({ total: count() })
      .from(notifications)
      .where(
        and(
          or(eq(notifications.clientId, clientId), isNull(notifications.clientId)),
          isNull(notifications.readAt),
        ),
      );
    return Number(result.total);
  }

  async markRead(id: string) {
    const [result] = await this.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return result;
  }

  async markAllRead(clientId: string) {
    await this.db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          or(eq(notifications.clientId, clientId), isNull(notifications.clientId)),
          isNull(notifications.readAt),
        ),
      );
  }

  async create(data: {
    clientId?: string;
    title: string;
    message: string;
    type?: string;
    source?: string;
  }) {
    const [result] = await this.db
      .insert(notifications)
      .values(data)
      .returning();
    return result;
  }
}
