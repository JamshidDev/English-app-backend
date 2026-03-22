import { Injectable } from '@nestjs/common';
import { VocabularyRepository } from './repository/vocabulary.repository';
import { ScoresService } from '../scores/scores.service';
import { RedisService } from '@shared/redis/redis.service';
import { CacheKeys, CacheTTL } from '@shared/redis/cache-keys';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly repo: VocabularyRepository,
    private readonly scoresService: ScoresService,
    private readonly redis: RedisService,
  ) {}

  async findByCollectionId(collectionId: string, clientId: string) {
    const cacheKey = CacheKeys.vocabulary(collectionId, clientId);
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const data = await this.repo.findByCollectionIdWithLearned(collectionId, clientId);
    await this.redis.set(cacheKey, data, CacheTTL.vocabulary);
    return data;
  }

  async learnWord(clientId: string, wordId: string, collectionId: string) {
    const result = await this.repo.markWordAsLearned(clientId, wordId, collectionId);
    await this.redis.del(CacheKeys.vocabulary(collectionId, clientId));
    return result;
  }

  async unlearnWord(clientId: string, wordId: string, collectionId: string) {
    await this.repo.unmarkWordAsLearned(clientId, wordId);
    if (collectionId) {
      await this.redis.del(CacheKeys.vocabulary(collectionId, clientId));
    }
  }

  async completeVocabulary(clientId: string, collectionId: string) {
    const learned = await this.repo.countLearnedByCollection(clientId, collectionId);
    const total = await this.repo.countTotalByCollection(collectionId);

    await this.scoresService.saveScore(clientId, collectionId, 'vocabulary', learned, total);

    // Cache invalidation
    await this.redis.del(CacheKeys.vocabulary(collectionId, clientId));
    await this.redis.del(CacheKeys.scores(collectionId, clientId));
    await this.redis.del(CacheKeys.scoresSummary(clientId));

    const percentage = total > 0 ? (learned / total) * 100 : 0;
    return {
      learned,
      total,
      percentage: Math.round(percentage),
      score: this.scoresService.calculateScore(percentage),
    };
  }
}
