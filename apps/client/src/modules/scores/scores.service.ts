import { Injectable } from '@nestjs/common';
import { ScoresRepository } from './repository/scores.repository';
import { ActivityService } from '../activity/activity.service';
import { RedisService } from '@shared/redis/redis.service';
import { CacheKeys, CacheTTL } from '@shared/redis/cache-keys';

@Injectable()
export class ScoresService {
  constructor(
    private readonly scoresRepository: ScoresRepository,
    private readonly activityService: ActivityService,
    private readonly redis: RedisService,
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
    await this.activityService.recordActivity(clientId);

    // Cache invalidation
    await this.redis.del(CacheKeys.scores(collectionId, clientId));
    await this.redis.del(CacheKeys.scoresSummary(clientId));
    await this.redis.delByPattern('cache:collection-stars:*:' + clientId);

    return this.scoresRepository.upsertScore(
      clientId,
      collectionId,
      type,
      score,
      percentage,
    );
  }

  async getCollectionScores(clientId: string, collectionId: string) {
    const cacheKey = CacheKeys.scores(collectionId, clientId);
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

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

    await this.redis.set(cacheKey, result, CacheTTL.scores);
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
