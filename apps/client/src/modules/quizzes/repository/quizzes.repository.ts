import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { quizzes, words } from '@shared/database/schema';
import { QuizQuestion } from '@shared/database/schema/quizzes.schema';

@Injectable()
export class QuizzesRepository {
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
    questions: QuizQuestion[];
    totalQuestions: number;
  }) {
    const [result] = await this.db
      .insert(quizzes)
      .values(data)
      .returning();
    return result;
  }

  async findActiveByClientAndCollection(
    clientId: string,
    collectionId: string,
  ) {
    const [result] = await this.db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.clientId, clientId),
          eq(quizzes.collectionId, collectionId),
          isNull(quizzes.completedAt),
        ),
      )
      .orderBy(quizzes.createdAt)
      .limit(1);
    return result ?? null;
  }

  async findByIdAndClient(id: string, clientId: string) {
    const [result] = await this.db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, id), eq(quizzes.clientId, clientId)))
      .limit(1);
    return result ?? null;
  }

  async updateQuestions(id: string, questions: QuizQuestion[]) {
    const [result] = await this.db
      .update(quizzes)
      .set({ questions })
      .where(eq(quizzes.id, id))
      .returning();
    return result;
  }

  async completeQuiz(id: string, correctAnswers: number) {
    const [result] = await this.db
      .update(quizzes)
      .set({ correctAnswers, completedAt: new Date() })
      .where(eq(quizzes.id, id))
      .returning();
    return result;
  }
}
