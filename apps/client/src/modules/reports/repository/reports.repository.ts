import { Injectable, Inject } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { reports, words } from '@shared/database/schema';
import { WordSnapshot } from '@shared/database/schema/reports.schema';

@Injectable()
export class ReportsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async getWordById(wordId: string) {
    const [result] = await this.db
      .select()
      .from(words)
      .where(eq(words.id, wordId))
      .limit(1);
    return result ?? null;
  }

  async create(data: {
    clientId: string;
    wordId: string;
    collectionId: string;
    page: string;
    message: string;
    wordSnapshot: WordSnapshot;
  }) {
    const [result] = await this.db
      .insert(reports)
      .values(data)
      .returning();
    return result;
  }
}
