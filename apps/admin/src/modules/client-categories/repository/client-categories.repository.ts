import { Injectable, Inject } from '@nestjs/common';
import { eq, and, asc } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clientCategories } from '@shared/database/schema';

@Injectable()
export class ClientCategoriesRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(data: typeof clientCategories.$inferInsert) {
    const [result] = await this.db
      .insert(clientCategories)
      .values(data)
      .returning();
    return result;
  }

  async findByClientId(clientId: string) {
    return this.db
      .select()
      .from(clientCategories)
      .where(eq(clientCategories.clientId, clientId))
      .orderBy(asc(clientCategories.order));
  }

  async findByClientAndCategory(clientId: string, categoryId: string) {
    const [result] = await this.db
      .select()
      .from(clientCategories)
      .where(
        and(
          eq(clientCategories.clientId, clientId),
          eq(clientCategories.categoryId, categoryId),
        ),
      )
      .limit(1);
    return result ?? null;
  }

  async findById(id: string) {
    const [result] = await this.db
      .select()
      .from(clientCategories)
      .where(eq(clientCategories.id, id))
      .limit(1);
    return result ?? null;
  }

  async getMaxOrder(clientId: string): Promise<number> {
    const rows = await this.db
      .select({ order: clientCategories.order })
      .from(clientCategories)
      .where(eq(clientCategories.clientId, clientId))
      .orderBy(asc(clientCategories.order));
    if (rows.length === 0) return -1;
    return rows[rows.length - 1].order;
  }

  async updateOrder(id: string, order: number) {
    const [result] = await this.db
      .update(clientCategories)
      .set({ order })
      .where(eq(clientCategories.id, id))
      .returning();
    return result;
  }

  async reorder(clientId: string, categoryIds: string[]) {
    return this.db.transaction(async (tx) => {
      for (let i = 0; i < categoryIds.length; i++) {
        await tx
          .update(clientCategories)
          .set({ order: i })
          .where(
            and(
              eq(clientCategories.clientId, clientId),
              eq(clientCategories.categoryId, categoryIds[i]),
            ),
          );
      }
    });
  }

  async delete(id: string) {
    const [result] = await this.db
      .delete(clientCategories)
      .where(eq(clientCategories.id, id))
      .returning();
    return result;
  }

  async deleteByClientAndCategory(clientId: string, categoryId: string) {
    const [result] = await this.db
      .delete(clientCategories)
      .where(
        and(
          eq(clientCategories.clientId, clientId),
          eq(clientCategories.categoryId, categoryId),
        ),
      )
      .returning();
    return result;
  }
}
