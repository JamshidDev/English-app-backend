import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull, sql, count } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { words, clientWords, savedWords } from '@shared/database/schema';

@Injectable()
export class VocabularyRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByCollectionIdWithLearned(collectionId: string, clientId: string) {
    return this.db
      .select({
        id: words.id,
        word: words.word,
        wordTranslate: words.wordTranslate,
        transcription: words.transcription,
        example: words.example,
        exampleTranslate: words.exampleTranslate,
        learned: sql<boolean>`CASE WHEN ${clientWords.id} IS NOT NULL THEN true ELSE false END`.as('learned'),
        saved: sql<boolean>`CASE WHEN ${savedWords.id} IS NOT NULL THEN true ELSE false END`.as('saved'),
      })
      .from(words)
      .leftJoin(
        clientWords,
        and(
          eq(clientWords.wordId, words.id),
          eq(clientWords.clientId, clientId),
        ),
      )
      .leftJoin(
        savedWords,
        and(
          eq(savedWords.wordId, words.id),
          eq(savedWords.clientId, clientId),
        ),
      )
      .where(
        and(
          eq(words.collectionId, collectionId),
          isNull(words.deletedAt),
        ),
      )
      .orderBy(words.createdAt);
  }

  async markWordAsLearned(clientId: string, wordId: string, collectionId: string) {
    const [result] = await this.db
      .insert(clientWords)
      .values({ clientId, wordId, collectionId })
      .onConflictDoNothing({ target: [clientWords.clientId, clientWords.wordId] })
      .returning();
    return result ?? null;
  }

  async unmarkWordAsLearned(clientId: string, wordId: string) {
    await this.db
      .delete(clientWords)
      .where(
        and(
          eq(clientWords.clientId, clientId),
          eq(clientWords.wordId, wordId),
        ),
      );
  }

  async countLearnedByCollection(clientId: string, collectionId: string) {
    const [result] = await this.db
      .select({ count: count() })
      .from(clientWords)
      .where(
        and(
          eq(clientWords.clientId, clientId),
          eq(clientWords.collectionId, collectionId),
        ),
      );
    return result?.count ?? 0;
  }

  async countTotalByCollection(collectionId: string) {
    const [result] = await this.db
      .select({ count: count() })
      .from(words)
      .where(
        and(
          eq(words.collectionId, collectionId),
          isNull(words.deletedAt),
        ),
      );
    return result?.count ?? 0;
  }
}
