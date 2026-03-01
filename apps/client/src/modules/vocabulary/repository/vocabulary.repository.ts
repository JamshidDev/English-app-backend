import { Injectable, Inject } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { words } from '@shared/database/schema';

@Injectable()
export class VocabularyRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByCollectionId(collectionId: string) {
    return this.db
      .select({
        id: words.id,
        word: words.word,
        wordTranslate: words.wordTranslate,
        transcription: words.transcription,
        example: words.example,
        exampleTranslate: words.exampleTranslate,
      })
      .from(words)
      .where(
        and(
          eq(words.collectionId, collectionId),
          isNull(words.deletedAt),
        ),
      )
      .orderBy(words.createdAt);
  }
}
