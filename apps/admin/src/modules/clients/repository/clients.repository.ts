import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, isNotNull, ilike, asc, count, or, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clients } from '@shared/database/schema';

@Injectable()
export class ClientsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: typeof clients.$inferInsert) {
    const [result] = await this.db.insert(clients).values(data).returning();
    return result;
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), isNull(clients.deletedAt)))
      .limit(1);
    return result ?? null;
  }

  async findByTelegramId(telegramId: string) {
    const [result] = await this.db
      .select()
      .from(clients)
      .where(and(eq(clients.telegramId, telegramId), isNull(clients.deletedAt)))
      .limit(1);
    return result ?? null;
  }

  async findWithPagination(options: {
    page: number;
    pageSize: number;
    search?: string;
    blocked?: boolean;
  }) {
    const conditions: SQL[] = [isNull(clients.deletedAt)];

    if (options.blocked === true) {
      conditions.push(isNotNull(clients.blockedAt));
    } else if (options.blocked === false) {
      conditions.push(isNull(clients.blockedAt));
    }
    if (options.search) {
      const s = `%${options.search}%`;
      conditions.push(
        or(
          ilike(clients.firstName, s),
          ilike(clients.telegramId, s),
          ilike(clients.phone, s),
        )!,
      );
    }

    const offset = (options.page - 1) * options.pageSize;

    return this.db
      .select()
      .from(clients)
      .where(and(...conditions))
      .orderBy(asc(clients.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async countAll(options: { search?: string; blocked?: boolean }) {
    const conditions: SQL[] = [isNull(clients.deletedAt)];

    if (options.blocked === true) {
      conditions.push(isNotNull(clients.blockedAt));
    } else if (options.blocked === false) {
      conditions.push(isNull(clients.blockedAt));
    }
    if (options.search) {
      const s = `%${options.search}%`;
      conditions.push(
        or(
          ilike(clients.firstName, s),
          ilike(clients.telegramId, s),
          ilike(clients.phone, s),
        )!,
      );
    }

    const [result] = await this.db
      .select({ total: count() })
      .from(clients)
      .where(and(...conditions));
    return Number(result.total);
  }

  async update(id: string, data: Partial<typeof clients.$inferInsert>) {
    const [result] = await this.db
      .update(clients)
      .set(data)
      .where(eq(clients.id, id))
      .returning();
    return result;
  }

  async softDelete(id: string) {
    const [result] = await this.db
      .update(clients)
      .set({ deletedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return result;
  }
}
