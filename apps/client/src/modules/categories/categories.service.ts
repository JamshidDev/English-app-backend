import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { QueryCategoryDto } from './dto/query-category.dto';
import { PaginatedResponse } from '@shared/types';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async findAllPublic(query: QueryCategoryDto): Promise<PaginatedResponse<any>> {
    const [data, total] = await Promise.all([
      this.repo.findPublicWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
      }),
      this.repo.countPublic({ search: query.search }),
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
