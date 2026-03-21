import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './repository/activity.repository';

@Injectable()
export class ActivityService {
  constructor(private readonly repo: ActivityRepository) {}

  async recordActivity(clientId: string) {
    await this.repo.recordActivity(clientId);
  }

  async getActiveDays(clientId: string, year: number, month: number) {
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    const rows = await this.repo.getActiveDays(clientId, from, to);
    return rows.map(r => r.date);
  }

  async getTotalActiveDays(clientId: string) {
    return this.repo.getTotalActiveDays(clientId);
  }
}
