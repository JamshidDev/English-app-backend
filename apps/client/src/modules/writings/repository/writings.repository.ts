import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { writings, words } from '@shared/database/schema';
import { WritingQuestion } from '@shared/database/schema/writings.schema';

@Injectable()
export class WritingsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findWordsByCollectionId(collectionId: string) {
    return this.db
      .select()
      .from(words)
      .where(and(eq(words.collectionId, collectionId), isNull(words.deletedAt)));
  }

  async create(data: {
    clientId: string;
    collectionId: string;
    questions: WritingQuestion[];
    totalQuestions: number;
  }) {
    const [result] = await this.db
      .insert(writings)
      .values(data)
      .returning();
    return result;
  }

  async findActiveByClientAndCollection(clientId: string, collectionId: string) {
    const [result] = await this.db
      .select()
      .from(writings)
      .where(
        and(
          eq(writings.clientId, clientId),
          eq(writings.collectionId, collectionId),
          isNull(writings.completedAt),
        ),
      )
      .orderBy(writings.createdAt)
      .limit(1);
    return result ?? null;
  }

  async findByIdAndClient(id: string, clientId: string) {
    const [result] = await this.db
      .select()
      .from(writings)
      .where(and(eq(writings.id, id), eq(writings.clientId, clientId)))
      .limit(1);
    return result ?? null;
  }

  async updateQuestions(id: string, questions: WritingQuestion[]) {
    const [result] = await this.db
      .update(writings)
      .set({ questions })
      .where(eq(writings.id, id))
      .returning();
    return result;
  }

  async completeWriting(id: string, correctAnswers: number) {
    const [result] = await this.db
      .update(writings)
      .set({ correctAnswers, completedAt: new Date() })
      .where(eq(writings.id, id))
      .returning();
    return result;
  }
}
