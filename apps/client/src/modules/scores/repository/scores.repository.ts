import { Injectable, Inject } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { scores } from '@shared/database/schema';

@Injectable()
export class ScoresRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async upsertScore(
    clientId: string,
    collectionId: string,
    type: string,
    score: number,
    percentage: number,
  ) {
    const [result] = await this.db
      .insert(scores)
      .values({ clientId, collectionId, type, score, percentage })
      .onConflictDoUpdate({
        target: [scores.clientId, scores.collectionId, scores.type],
        set: {
          score: sql`CASE WHEN ${scores.score} < excluded.score THEN excluded.score ELSE ${scores.score} END`,
          percentage: sql`CASE WHEN ${scores.score} < excluded.score THEN excluded.percentage ELSE ${scores.percentage} END`,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async findByClientAndCollection(clientId: string, collectionId: string) {
    return this.db
      .select()
      .from(scores)
      .where(
        and(
          eq(scores.clientId, clientId),
          eq(scores.collectionId, collectionId),
        ),
      );
  }

  async findAllByClient(clientId: string) {
    return this.db
      .select()
      .from(scores)
      .where(eq(scores.clientId, clientId));
  }
}
