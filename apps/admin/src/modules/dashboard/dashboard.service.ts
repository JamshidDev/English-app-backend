import { Injectable, Inject } from '@nestjs/common';
import { sql, count, isNull, isNotNull, eq, gte, and } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import {
  words, collections, clients, quizzes, scores,
  clientActivity, categories,
} from '@shared/database/schema';

@Injectable()
export class DashboardService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async getStats() {
    const [
      totalWords,
      totalCollections,
      totalClients,
      totalCategories,
      totalQuizzes,
      completedQuizzes,
      audioWords,
      todayActive,
    ] = await Promise.all([
      this.db.select({ count: count() }).from(words).where(isNull(words.deletedAt)),
      this.db.select({ count: count() }).from(collections).where(isNull(collections.deletedAt)),
      this.db.select({ count: count() }).from(clients).where(isNull(clients.deletedAt)),
      this.db.select({ count: count() }).from(categories).where(isNull(categories.deletedAt)),
      this.db.select({ count: count() }).from(quizzes),
      this.db.select({ count: count() }).from(quizzes).where(isNotNull(quizzes.completedAt)),
      this.db.select({ count: count() }).from(words).where(and(isNull(words.deletedAt), isNotNull(words.audioUrl))),
      this.db.select({ count: count() }).from(clientActivity).where(
        eq(clientActivity.date, sql`CURRENT_DATE`),
      ),
    ]);

    return {
      totalWords: Number(totalWords[0].count),
      totalCollections: Number(totalCollections[0].count),
      totalClients: Number(totalClients[0].count),
      totalCategories: Number(totalCategories[0].count),
      totalQuizzes: Number(totalQuizzes[0].count),
      completedQuizzes: Number(completedQuizzes[0].count),
      audioWords: Number(audioWords[0].count),
      todayActiveUsers: Number(todayActive[0].count),
    };
  }

  async getWeeklyActivity() {
    const result = await this.db.execute(sql`
      SELECT
        d::date as date,
        COALESCE(COUNT(DISTINCT ca.client_id), 0) as active_users
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        '1 day'
      ) d
      LEFT JOIN client_activity ca ON ca.date = d::date
      GROUP BY d::date
      ORDER BY d::date
    `);

    const rows = (result as any).rows || result;
    return (rows as any[]).map(r => ({
      date: r.date,
      activeUsers: Number(r.active_users),
    }));
  }

  async getTopCollections() {
    const result = await this.db.execute(sql`
      SELECT
        c.name->>'uz' as name,
        COUNT(q.id) as quiz_count,
        COUNT(CASE WHEN q.completed_at IS NOT NULL THEN 1 END) as completed_count
      FROM collections c
      LEFT JOIN quizzes q ON q.collection_id = c.id
      WHERE c.deleted_at IS NULL
      GROUP BY c.id, c.name
      ORDER BY quiz_count DESC
      LIMIT 10
    `);

    const rows = (result as any).rows || result;
    return (rows as any[]).map(r => ({
      name: r.name,
      quizCount: Number(r.quiz_count),
      completedCount: Number(r.completed_count),
    }));
  }

  async getRecentClients() {
    const result = await this.db
      .select({
        id: clients.id,
        firstName: clients.firstName,
        lastName: clients.lastName,
        telegramId: clients.telegramId,
        createdAt: clients.createdAt,
      })
      .from(clients)
      .where(isNull(clients.deletedAt))
      .orderBy(sql`${clients.createdAt} DESC`)
      .limit(5);

    return result;
  }
}
