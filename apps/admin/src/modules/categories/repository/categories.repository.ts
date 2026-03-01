import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, asc, count, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { categories } from '@shared/database/schema';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: typeof categories.$inferInsert) {
    const [result] = await this.db
      .insert(categories)
      .values(data)
      .returning();
    return result;
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
      .limit(1);
    return result ?? null;
  }

  async findWithPagination(options: {
    page: number;
    pageSize: number;
    search?: string;
    public?: boolean;
  }) {
    const conditions: SQL[] = [isNull(categories.deletedAt)];

    if (options.public !== undefined) {
      conditions.push(eq(categories.public, options.public));
    }
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

  async countAll(options: { search?: string; public?: boolean }) {
    const conditions: SQL[] = [isNull(categories.deletedAt)];

    if (options.public !== undefined) {
      conditions.push(eq(categories.public, options.public));
    }
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

  async update(id: string, data: Partial<typeof categories.$inferInsert>) {
    const [result] = await this.db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result;
  }

  async softDelete(id: string) {
    const [result] = await this.db
      .update(categories)
      .set({ deletedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result;
  }
}
