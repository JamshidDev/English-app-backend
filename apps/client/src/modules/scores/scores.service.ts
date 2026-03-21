import { Injectable } from '@nestjs/common';
import { ScoresRepository } from './repository/scores.repository';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ScoresService {
  constructor(
    private readonly scoresRepository: ScoresRepository,
    private readonly activityService: ActivityService,
  ) {}

  calculateScore(percentage: number): number {
    if (percentage >= 90) return 1;
    if (percentage >= 50) return 0.5;
    return 0;
  }

  async saveScore(
    clientId: string,
    collectionId: string,
    type: string,
    correctCount: number,
    totalCount: number,
  ) {
    const percentage =
      totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    const score = this.calculateScore(percentage);
    // Activity record qilish (kundalik faollik)
    await this.activityService.recordActivity(clientId);

    return this.scoresRepository.upsertScore(
      clientId,
      collectionId,
      type,
      score,
      percentage,
    );
  }

  async getCollectionScores(clientId: string, collectionId: string) {
    const rows = await this.scoresRepository.findByClientAndCollection(
      clientId,
      collectionId,
    );

    const result = {
      vocabulary: null as number | null,
      quiz: null as number | null,
      writing: null as number | null,
      stars: { vocabulary: false, quiz: false, writing: false },
      totalStars: 0,
    };

    for (const row of rows) {
      if (row.type === 'vocabulary' || row.type === 'quiz' || row.type === 'writing') {
        result[row.type] = row.score;
        result.stars[row.type] = row.score === 1;
        if (row.score === 1) result.totalStars++;
      }
    }

    return result;
  }

  async getStarsByClientAndCollections(clientId: string) {
    const rows = await this.scoresRepository.findAllByClient(clientId);

    const map: Record<string, { vocabulary: boolean; quiz: boolean; writing: boolean; totalStars: number }> = {};

    for (const row of rows) {
      if (!map[row.collectionId]) {
        map[row.collectionId] = { vocabulary: false, quiz: false, writing: false, totalStars: 0 };
      }
      if (row.score === 1 && (row.type === 'vocabulary' || row.type === 'quiz' || row.type === 'writing')) {
        map[row.collectionId][row.type] = true;
        map[row.collectionId].totalStars++;
      }
    }

    return map;
  }
}
