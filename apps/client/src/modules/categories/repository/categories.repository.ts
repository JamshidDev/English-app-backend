import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { categories } from '@shared/database/schema';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findPublicWithPagination(options: {
    page: number;
    pageSize: number;
    search?: string;
  }) {
    const conditions: SQL[] = [
      isNull(categories.deletedAt),
      eq(categories.public, true),
    ];

    if (options.search) {
      conditions.push(
        sql`(${categories.name}->>'uz' ILIKE ${'%' + options.search + '%'} OR ${categories.name}->>'ru' ILIKE ${'%' + options.search + '%'})`,
      );
    }

    const offset = (options.page - 1) * options.pageSize;

    return this.db
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async countPublic(options: { search?: string }) {
    const conditions: SQL[] = [
      isNull(categories.deletedAt),
      eq(categories.public, true),
    ];

    if (options.search) {
      conditions.push(
        sql`(${categories.name}->>'uz' ILIKE ${'%' + options.search + '%'} OR ${categories.name}->>'ru' ILIKE ${'%' + options.search + '%'})`,
      );
    }

    const [result] = await this.db
      .select({ total: count() })
      .from(categories)
      .where(and(...conditions));
    return Number(result.total);
  }
}
