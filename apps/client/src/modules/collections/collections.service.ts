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
    if (!query.search && query.categoryId) {
      const cacheKey = CacheKeys.collections(query.categoryId);
      const cached = await this.redis.get<PaginatedResponse<any>>(cacheKey);
      if (cached) return cached;
    }

    const [data, total] = await Promise.all([
      this.repo.findPublicByCategoryIdWithStars({
        categoryId: query.categoryId,
        clientId,
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
      }),
      this.repo.countPublicByCategoryId({
        categoryId: query.categoryId,
        search: query.search,
      }),
    ]);

    const pageCount = Math.ceil(total / query.pageSize);

    const dataWithStars = data.map((item) => ({
      ...item,
      stars: {
        vocabulary: item.vocabularyStar,
        writing: item.writingStar,
        quiz: item.quizStar,
      },
      totalStars: [item.vocabularyStar, item.writingStar, item.quizStar].filter(Boolean).length,
    }));

    const result: PaginatedResponse<any> = {
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

    if (!query.search && query.categoryId) {
      await this.redis.set(CacheKeys.collections(query.categoryId), result, CacheTTL.collections);
    }

    return result;
  }
}
