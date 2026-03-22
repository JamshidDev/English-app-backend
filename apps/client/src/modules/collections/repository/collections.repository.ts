import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { collections } from '@shared/database/schema';

@Injectable()
export class CollectionsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findPublicByCategoryIdWithStars(options: {
    categoryId: string;
    clientId: string;
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
        vocabularyStar: sql<boolean>`COALESCE((SELECT s.score = 1 FROM scores s WHERE s.client_id = ${options.clientId} AND s.collection_id = collections.id AND s.type = 'vocabulary'), false)`.as('vocabulary_star'),
        writingStar: sql<boolean>`COALESCE((SELECT s.score = 1 FROM scores s WHERE s.client_id = ${options.clientId} AND s.collection_id = collections.id AND s.type = 'writing'), false)`.as('writing_star'),
        quizStar: sql<boolean>`COALESCE((SELECT s.score = 1 FROM scores s WHERE s.client_id = ${options.clientId} AND s.collection_id = collections.id AND s.type = 'quiz'), false)`.as('quiz_star'),
      })
      .from(collections)
      .where(and(...conditions))
      .orderBy(asc(collections.createdAt))
      .limit(options.pageSize)
      .offset(offset);
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
