import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { RedisService } from '@shared/redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { PaginatedResponse } from '@shared/types';

const CACHE_PREFIX = 'admin:categories';
const CACHE_TTL = 300;

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = await this.repo.create({
      name: dto.name,
      public: dto.public ?? false,
    });

    await this.invalidateCache();
    return category;
  }

  async findAll(query: QueryCategoryDto): Promise<PaginatedResponse<any>> {
    const cacheKey = `${CACHE_PREFIX}:list:${JSON.stringify(query)}`;
    const cached = await this.redis.get<PaginatedResponse<any>>(cacheKey);
    if (cached) return cached;

    const [data, total] = await Promise.all([
      this.repo.findWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        public: query.public,
      }),
      this.repo.countAll({
        search: query.search,
        public: query.public,
      }),
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

    await this.redis.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_PREFIX}:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.redis.set(cacheKey, category, CACHE_TTL);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updated = await this.repo.update(id, dto);
    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const deleted = await this.repo.softDelete(id);
    await this.invalidateCache();
    return deleted;
  }

  async togglePublic(id: string) {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updated = await this.repo.update(id, {
      public: !category.public,
    });
    await this.invalidateCache();
    return updated;
  }

  private async invalidateCache() {
    await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
  }
}
