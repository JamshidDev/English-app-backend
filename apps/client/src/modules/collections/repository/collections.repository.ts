import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { collections } from '@shared/database/schema';

@Injectable()
export class CollectionsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findPublicByCategoryId(options: {
    categoryId: string;
    page: number;
    pageSize: number;
    search?: string;
  }) {
    const conditions: SQL[] = [
      isNull(collections.deletedAt),
      eq(collections.public, true),
      eq(collections.categoryId, options.categoryId),
    ];

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
        isNew: collections.isNew,
        createdAt: collections.createdAt,
        wordCount: sql<number>`(SELECT count(*)::int FROM words w WHERE w.collection_id = collections.id AND w.deleted_at IS NULL)`.as('word_count'),
      })
      .from(collections)
      .where(and(...conditions))
      .orderBy(asc(collections.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async findStarsByClientAndCategory(clientId: string, collectionIds: string[]) {
    if (collectionIds.length === 0) return {};

    const result = await this.db.execute(sql`
      SELECT
        s.collection_id,
        s.type,
        s.score
      FROM scores s
      WHERE s.client_id = ${clientId}
        AND s.collection_id = ANY(${collectionIds})
    `);

    const starsMap: Record<string, { vocabulary: boolean; writing: boolean; quiz: boolean }> = {};
    for (const row of result.rows as any[]) {
      if (!starsMap[row.collection_id]) {
        starsMap[row.collection_id] = { vocabulary: false, writing: false, quiz: false };
      }
      starsMap[row.collection_id][row.type as 'vocabulary' | 'writing' | 'quiz'] = row.score === 1;
    }
    return starsMap;
  }

  async countPublicByCategoryId(options: {
    categoryId: string;
    search?: string;
  }) {
    const conditions: SQL[] = [
      isNull(collections.deletedAt),
      eq(collections.public, true),
      eq(collections.categoryId, options.categoryId),
    ];

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

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(collections)
      .where(and(eq(collections.id, id), isNull(collections.deletedAt)))
      .limit(1);
    return result ?? null;
  }
}
