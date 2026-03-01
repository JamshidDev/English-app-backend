import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientCategoriesRepository } from './repository/client-categories.repository';
import { CategoriesService } from '../categories/categories.service';
import { SaveClientCategoriesDto } from './dto/save-client-categories.dto';
import { QueryCategoryDto } from '../categories/dto/query-category.dto';

@Injectable()
export class ClientCategoriesService {
  constructor(
    private readonly repo: ClientCategoriesRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getMyCategories(clientId: string, query: QueryCategoryDto) {
    const count = await this.repo.countByClientId(clientId);

    if (count === 0) {
      return this.categoriesService.findAllPublic(query);
    }

    return this.repo.findByClientId(clientId);
  }

  async saveCategories(clientId: string, dto: SaveClientCategoriesDto) {
    await this.repo.replaceAll(clientId, dto.categoryIds);
    return this.repo.findByClientId(clientId);
  }
}
