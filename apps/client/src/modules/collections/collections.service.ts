import { Injectable } from '@nestjs/common';
import { CollectionsRepository } from './repository/collections.repository';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { PaginatedResponse } from '@shared/types';

@Injectable()
export class CollectionsService {
  constructor(private readonly repo: CollectionsRepository) {}

  async findByCategoryId(query: QueryCollectionDto): Promise<PaginatedResponse<any>> {
    const [data, total] = await Promise.all([
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

    const pageCount = Math.ceil(total / query.pageSize);

    return {
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
  }
}
