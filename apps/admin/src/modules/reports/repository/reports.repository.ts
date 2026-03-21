import { Injectable, Inject } from '@nestjs/common';
import { eq, and, sql, count, desc, SQL } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { reports, clients, words, collections } from '@shared/database/schema';

@Injectable()
export class AdminReportsRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findWithPagination(options: {
    status?: string;
    page: number;
    pageSize: number;
  }) {
    const conditions: SQL[] = [];
    if (options.status) {
      conditions.push(eq(reports.status, options.status));
    }

    const offset = (options.page - 1) * options.pageSize;
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    return this.db
      .select({
        id: reports.id,
        page: reports.page,
        message: reports.message,
        wordSnapshot: reports.wordSnapshot,
        status: reports.status,
        createdAt: reports.createdAt,
        wordId: reports.wordId,
        collectionId: reports.collectionId,
        clientName: sql<string>`${clients.firstName} || ' ' || COALESCE(${clients.lastName}, '')`.as('client_name'),
        clientTelegramId: clients.telegramId,
        wordCurrent: words.word,
        collectionName: collections.name,
      })
      .from(reports)
      .innerJoin(clients, eq(reports.clientId, clients.id))
      .innerJoin(words, eq(reports.wordId, words.id))
      .innerJoin(collections, eq(reports.collectionId, collections.id))
      .where(where)
      .orderBy(desc(reports.createdAt))
      .limit(options.pageSize)
      .offset(offset);
  }

  async countAll(status?: string) {
    const conditions: SQL[] = [];
    if (status) {
      conditions.push(eq(reports.status, status));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ total: count() })
      .from(reports)
      .where(where);
    return Number(result.total);
  }

  async findById(id: string) {
    const [result] = await this.db
      .select({
        id: reports.id,
        clientId: reports.clientId,
        wordId: reports.wordId,
        collectionId: reports.collectionId,
        page: reports.page,
        message: reports.message,
        wordSnapshot: reports.wordSnapshot,
        status: reports.status,
        createdAt: reports.createdAt,
        clientName: sql<string>`${clients.firstName} || ' ' || COALESCE(${clients.lastName}, '')`.as('client_name'),
        clientTelegramId: clients.telegramId,
        wordCurrent: words.word,
        wordTranslateCurrent: words.wordTranslate,
        transcriptionCurrent: words.transcription,
        exampleCurrent: words.example,
        exampleTranslateCurrent: words.exampleTranslate,
        collectionName: collections.name,
      })
      .from(reports)
      .innerJoin(clients, eq(reports.clientId, clients.id))
      .innerJoin(words, eq(reports.wordId, words.id))
      .innerJoin(collections, eq(reports.collectionId, collections.id))
      .where(eq(reports.id, id))
      .limit(1);
    return result ?? null;
  }

  async updateStatus(id: string, status: string) {
    const [result] = await this.db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, id))
      .returning();
    return result;
  }

  async updateWord(wordId: string, data: Record<string, any>) {
    const [result] = await this.db
      .update(words)
      .set(data)
      .where(eq(words.id, wordId))
      .returning();
    return result;
  }

  async getStats() {
    const result = await this.db
      .select({
        status: reports.status,
        count: count(),
      })
      .from(reports)
      .groupBy(reports.status);

    const stats = { pending: 0, fixed: 0, skipped: 0 };
    for (const row of result) {
      if (row.status === 'pending' || row.status === 'fixed' || row.status === 'skipped') {
        stats[row.status] = Number(row.count);
      }
    }
    return stats;
  }
}
