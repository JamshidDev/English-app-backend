import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionsRepository } from './repository/collections.repository';
import { RedisService } from '@shared/redis/redis.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { PaginatedResponse } from '@shared/types';

const CACHE_PREFIX = 'admin:collections';
const CACHE_TTL = 300;

@Injectable()
export class CollectionsService {
  constructor(
    private readonly repo: CollectionsRepository,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateCollectionDto) {
    const collection = await this.repo.create({
      categoryId: dto.categoryId,
      name: dto.name,
      public: dto.public ?? false,
    });

    await this.invalidateCache();
    return collection;
  }

  async findAll(query: QueryCollectionDto): Promise<PaginatedResponse<any>> {
    const cacheKey = `${CACHE_PREFIX}:list:${JSON.stringify(query)}`;
    const cached = await this.redis.get<PaginatedResponse<any>>(cacheKey);
    if (cached) return cached;

    const [data, total] = await Promise.all([
      this.repo.findWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        categoryId: query.categoryId,
        public: query.public,
      }),
      this.repo.countAll({
        search: query.search,
        categoryId: query.categoryId,
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
    const collection = await this.repo.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const collection = await this.repo.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');

    const updated = await this.repo.update(id, dto);
    await this.invalidateCache();
    return updated;
  }

  async softDelete(id: string) {
    const collection = await this.repo.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');

    const deleted = await this.repo.softDelete(id);
    await this.invalidateCache();
    return deleted;
  }

  async togglePublic(id: string) {
    const collection = await this.repo.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');

    const updated = await this.repo.update(id, {
      public: !collection.public,
    });
    await this.invalidateCache();
    return updated;
  }

  async toggleNew(id: string) {
    const collection = await this.repo.findById(id);
    if (!collection) throw new NotFoundException('Collection not found');

    const updated = await this.repo.update(id, {
      isNew: !collection.isNew,
    });
    await this.invalidateCache();
    return updated;
  }

  private async invalidateCache() {
    await this.redis.delByPattern(`${CACHE_PREFIX}:*`);
    await this.redis.delByPattern('cache:collections:*');
  }
}
