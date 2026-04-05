import { Injectable } from '@nestjs/common';
import { CollectionsRepository } from './repository/collections.repository';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { PaginatedResponse } from '@shared/types';
import { RedisService } from '@shared/redis/redis.service';
import { CacheKeys, CacheTTL } from '@shared/redis/cache-keys';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly repo: CollectionsRepository,
    private readonly redis: RedisService,
  ) {}

  async findById(id: string) {
    return this.repo.findById(id);
  }

  async findByCategoryId(query: QueryCollectionDto, clientId: string): Promise<PaginatedResponse<any>> {
    const canCache = !query.search && query.categoryId;

    // 1. Collection list (starsiz) — hammaga bir xil
    let data: any[];
    let total: number;

    if (canCache) {
      const cacheKey = CacheKeys.collections(query.categoryId);
      const cached = await this.redis.get<{ data: any[]; total: number }>(cacheKey);
      if (cached) {
        data = cached.data;
        total = cached.total;
      } else {
        [data, total] = await Promise.all([
          this.repo.findPublicByCategoryId({
            categoryId: query.categoryId,
            page: query.page,
            pageSize: query.pageSize,
            search: query.search,
          }),
          this.repo.countPublicByCategoryId({
            categoryId: query.categoryId,
            search: query.search,
          }),
        ]);
        await this.redis.set(cacheKey, { data, total }, CacheTTL.collections);
      }
    } else {
      [data, total] = await Promise.all([
        this.repo.findPublicByCategoryId({
          categoryId: query.categoryId,
          page: query.page,
          pageSize: query.pageSize,
          search: query.search,
        }),
        this.repo.countPublicByCategoryId({
          categoryId: query.categoryId,
          search: query.search,
        }),
      ]);
    }

    // 2. Star ma'lumotlari — har bir user uchun alohida
    const collectionIds = data.map((c) => c.id);
    let starsMap: Record<string, { vocabulary: boolean; writing: boolean; quiz: boolean }> = {};

    if (collectionIds.length > 0 && canCache) {
      const starsCacheKey = CacheKeys.collectionStars(query.categoryId, clientId);
      const cachedStars = await this.redis.get<typeof starsMap>(starsCacheKey);
      if (cachedStars) {
        starsMap = cachedStars;
      } else {
        starsMap = await this.repo.findStarsByClientAndCategory(clientId, collectionIds);
        await this.redis.set(starsCacheKey, starsMap, CacheTTL.scores);
      }
    } else if (collectionIds.length > 0) {
      starsMap = await this.repo.findStarsByClientAndCategory(clientId, collectionIds);
    }

    // 3. Birlashtirish
    const pageCount = Math.ceil(total / query.pageSize);
    const dataWithStars = data.map((item) => {
      const stars = starsMap[item.id] || { vocabulary: false, writing: false, quiz: false };
      return {
        ...item,
        stars,
        totalStars: [stars.vocabulary, stars.writing, stars.quiz].filter(Boolean).length,
      };
    });

    return {
      data: dataWithStars,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount,
        hasNextPage: query.page < pageCount,
        hasPreviousPage: query.page > 1,
      },
    };
  }
}
