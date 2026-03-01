import { Injectable, Inject } from '@nestjs/common';
import { eq, and, asc, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clientCategories, categories } from '@shared/database/schema';

@Injectable()
export class ClientCategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByClientId(clientId: string) {
    return this.db
      .select({
        id: clientCategories.id,
        clientId: clientCategories.clientId,
        categoryId: clientCategories.categoryId,
        order: clientCategories.order,
        createdAt: clientCategories.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          public: categories.public,
        },
      })
      .from(clientCategories)
      .innerJoin(categories, and(
        eq(clientCategories.categoryId, categories.id),
        isNull(categories.deletedAt),
      ))
      .where(eq(clientCategories.clientId, clientId))
      .orderBy(asc(clientCategories.order));
  }

  async countByClientId(clientId: string): Promise<number> {
    const rows = await this.db
      .select({ id: clientCategories.id })
      .from(clientCategories)
      .where(eq(clientCategories.clientId, clientId));
    return rows.length;
  }

  async replaceAll(clientId: string, categoryIds: string[]) {
    return this.db.transaction(async (tx) => {
      await tx
        .delete(clientCategories)
        .where(eq(clientCategories.clientId, clientId));

      if (categoryIds.length === 0) return [];

      const values = categoryIds.map((categoryId, index) => ({
        clientId,
        categoryId,
        order: index,
      }));

      return tx.insert(clientCategories).values(values).returning();
    });
  }
}
