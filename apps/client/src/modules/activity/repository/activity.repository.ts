import { Injectable, Inject } from '@nestjs/common';
import { eq, and, gte, lte, count } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clientActivity } from '@shared/database/schema';

@Injectable()
export class ActivityRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async recordActivity(clientId: string) {
    const today = new Date().toISOString().split('T')[0];
    await this.db
      .insert(clientActivity)
      .values({ clientId, date: today })
      .onConflictDoNothing({ target: [clientActivity.clientId, clientActivity.date] });
  }

  async getActiveDays(clientId: string, from: string, to: string) {
    return this.db
      .select({ date: clientActivity.date })
      .from(clientActivity)
      .where(
        and(
          eq(clientActivity.clientId, clientId),
          gte(clientActivity.date, from),
          lte(clientActivity.date, to),
        ),
      );
  }

  async getTotalActiveDays(clientId: string) {
    const [result] = await this.db
      .select({ total: count() })
      .from(clientActivity)
      .where(eq(clientActivity.clientId, clientId));
    return Number(result.total);
  }
}
