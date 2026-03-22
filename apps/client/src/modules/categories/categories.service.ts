import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { QueryCategoryDto } from './dto/query-category.dto';
import { PaginatedResponse } from '@shared/types';
import { RedisService } from '@shared/redis/redis.service';
import { CacheKeys, CacheTTL } from '@shared/redis/cache-keys';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly redis: RedisService,
  ) {}

  async findAllPublic(query: QueryCategoryDto): Promise<PaginatedResponse<any>> {
    // Cache faqat default query uchun (search yo'q)
    if (!query.search) {
      const cacheKey = CacheKeys.categories();
      const cached = await this.redis.get<PaginatedResponse<any>>(cacheKey);
      if (cached) return cached;
    }

    const [data, total] = await Promise.all([
      this.repo.findPublicWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
      }),
      this.repo.countPublic({ search: query.search }),
    ]);

    const pageCount = Math.ceil(total / query.pageSize);

    const result: PaginatedResponse<any> = {
      data,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount,
        hasNextPage: query.page < pageCount,
        hasPreviousPage: query.page > 1,
      },
    };

    if (!query.search) {
      await this.redis.set(CacheKeys.categories(), result, CacheTTL.categories);
    }

    return result;
  }
}
