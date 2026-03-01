import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { collections } from '@shared/database/schema';

@Injectable()
export class CollectionsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: typeof collections.$inferInsert) {
    const [result] = await this.db
      .insert(collections)
      .values(data)
      .returning();
    return result;
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(collections)
      .where(and(eq(collections.id, id), isNull(collections.deletedAt)))
      .limit(1);
    return result ?? null;
  }

  async findWithPagination(options: {
    page: number;
    pageSize: number;
    search?: string;
    categoryId?: string;
    public?: boolean;
  }) {
    const conditions: SQL[] = [isNull(collections.deletedAt)];

    if (options.categoryId) {
      conditions.push(eq(collections.categoryId, options.categoryId));
    }
    if (options.public !== undefined) {
      conditions.push(eq(collections.public, options.public));
    }
    if (options.search) {
      conditions.push(
        sql`(${collections.name}->>'uz' ILIKE ${'%' + options.search + '%'} OR ${collections.name}->>'ru' ILIKE ${'%' + options.search + '%'})`,
      );
    }

    const offset = (options.page - 1) * options.pageSize;

    return this.db
      .select({
        id: collections.id,
        categoryId: collections.categoryId,
        name: collections.name,
        public: collections.public,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
        deletedAt: collections.deletedAt,
        wordCount: sql<number>`(SELECT count(*)::int FROM words w WHERE w.collection_id = collections.id AND w.deleted_at IS NULL)`.as('word_count'),
      })
      .from(collections)
      .where(and(...conditions))
      .orderBy(asc(collections.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async countAll(options: { search?: string; categoryId?: string; public?: boolean }) {
    const conditions: SQL[] = [isNull(collections.deletedAt)];

    if (options.categoryId) {
      conditions.push(eq(collections.categoryId, options.categoryId));
    }
    if (options.public !== undefined) {
      conditions.push(eq(collections.public, options.public));
    }
    if (options.search) {
      conditions.push(
        sql`(${collections.name}->>'uz' ILIKE ${'%' + options.search + '%'} OR ${collections.name}->>'ru' ILIKE ${'%' + options.search + '%'})`,
      );
    }

    const [result] = await this.db
      .select({ total: count() })
      .from(collections)
      .where(and(...conditions));
    return Number(result.total);
  }

  async update(id: string, data: Partial<typeof collections.$inferInsert>) {
    const [result] = await this.db
      .update(collections)
      .set(data)
      .where(eq(collections.id, id))
      .returning();
    return result;
  }

  async softDelete(id: string) {
    const [result] = await this.db
      .update(collections)
      .set({ deletedAt: new Date() })
      .where(eq(collections.id, id))
      .returning();
    return result;
  }
}
