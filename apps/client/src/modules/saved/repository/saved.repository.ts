import { Injectable, Inject } from '@nestjs/common';
import { eq, and, desc, count } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { savedWords, words } from '@shared/database/schema';

@Injectable()
export class SavedRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async saveWord(clientId: string, wordId: string) {
    const [result] = await this.db
      .insert(savedWords)
      .values({ clientId, wordId })
      .onConflictDoNothing({ target: [savedWords.clientId, savedWords.wordId] })
      .returning();
    return result ?? null;
  }

  async unsaveWord(clientId: string, wordId: string) {
    await this.db
      .delete(savedWords)
      .where(and(eq(savedWords.clientId, clientId), eq(savedWords.wordId, wordId)));
  }

  async isWordSaved(clientId: string, wordId: string): Promise<boolean> {
    const [result] = await this.db
      .select({ id: savedWords.id })
      .from(savedWords)
      .where(and(eq(savedWords.clientId, clientId), eq(savedWords.wordId, wordId)))
      .limit(1);
    return !!result;
  }

  async getSavedWords(clientId: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.db
      .select({
        id: savedWords.id,
        wordId: savedWords.wordId,
        createdAt: savedWords.createdAt,
        word: words.word,
        wordTranslate: words.wordTranslate,
        transcription: words.transcription,
        example: words.example,
        exampleTranslate: words.exampleTranslate,
      })
      .from(savedWords)
      .innerJoin(words, eq(savedWords.wordId, words.id))
      .where(eq(savedWords.clientId, clientId))
      .orderBy(desc(savedWords.createdAt))
      .limit(pageSize)
      .offset(offset);
  }

  async countSavedWords(clientId: string) {
    const [result] = await this.db
      .select({ total: count() })
      .from(savedWords)
      .where(eq(savedWords.clientId, clientId));
    return Number(result.total);
  }
}
