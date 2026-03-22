import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, ilike, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { words } from '@shared/database/schema';

@Injectable()
export class WordsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: typeof words.$inferInsert) {
    const [result] = await this.db.insert(words).values(data).returning();
    return result;
  }

  async bulkCreate(items: (typeof words.$inferInsert)[]) {
    return this.db.transaction(async (tx) => {
      return tx.insert(words).values(items).returning();
    });
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(words)
      .where(and(eq(words.id, id), isNull(words.deletedAt)))
      .limit(1);
    return result ?? null;
  }

  async findWithPagination(options: {
    page: number;
    pageSize: number;
    search?: string;
    collectionId?: string;
  }) {
    const conditions: SQL[] = [isNull(words.deletedAt)];

    if (options.collectionId) {
      conditions.push(eq(words.collectionId, options.collectionId));
    }
    if (options.search) {
      conditions.push(ilike(words.word, `%${options.search}%`));
    }

    const offset = (options.page - 1) * options.pageSize;

    return this.db
      .select()
      .from(words)
      .where(and(...conditions))
      .orderBy(asc(words.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async countAll(options: { search?: string; collectionId?: string }) {
    const conditions: SQL[] = [isNull(words.deletedAt)];

    if (options.collectionId) {
      conditions.push(eq(words.collectionId, options.collectionId));
    }
    if (options.search) {
      conditions.push(ilike(words.word, `%${options.search}%`));
    }

    const [result] = await this.db
      .select({ total: count() })
      .from(words)
      .where(and(...conditions));
    return Number(result.total);
  }

  async update(id: string, data: Partial<typeof words.$inferInsert>) {
    const [result] = await this.db
      .update(words)
      .set(data)
      .where(eq(words.id, id))
      .returning();
    return result;
  }

  async findByCollectionId(collectionId: string) {
    return this.db
      .select()
      .from(words)
      .where(and(eq(words.collectionId, collectionId), isNull(words.deletedAt)))
      .orderBy(asc(words.createdAt));
  }

  async updateAudioUrl(id: string, audioUrl: string) {
    const [result] = await this.db
      .update(words)
      .set({ audioUrl })
      .where(eq(words.id, id))
      .returning();
    return result;
  }

  async softDelete(id: string) {
    const [result] = await this.db
      .update(words)
      .set({ deletedAt: new Date() })
      .where(eq(words.id, id))
      .returning();
    return result;
  }
}
