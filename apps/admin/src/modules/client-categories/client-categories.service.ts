import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientCategoriesRepository } from './repository/client-categories.repository';
import { CreateClientCategoryDto } from './dto/create-client-category.dto';
import { ReorderClientCategoriesDto } from './dto/reorder-client-categories.dto';

@Injectable()
export class ClientCategoriesService {
  constructor(private readonly repo: ClientCategoriesRepository) {}

  async create(dto: CreateClientCategoryDto) {
    const existing = await this.repo.findByClientAndCategory(
      dto.clientId,
      dto.categoryId,
    );
    if (existing) {
      throw new ConflictException('Client already has this category');
    }

    const order = dto.order ?? (await this.repo.getMaxOrder(dto.clientId)) + 1;

    return this.repo.create({
      clientId: dto.clientId,
      categoryId: dto.categoryId,
      order,
    });
  }

  async findByClientId(clientId: string) {
    return this.repo.findByClientId(clientId);
  }

  async reorder(clientId: string, dto: ReorderClientCategoriesDto) {
    await this.repo.reorder(clientId, dto.categoryIds);
    return this.repo.findByClientId(clientId);
  }

  async remove(id: string) {
    const record = await this.repo.findById(id);
    if (!record) throw new NotFoundException('Client category not found');
    return this.repo.delete(id);
  }
}
