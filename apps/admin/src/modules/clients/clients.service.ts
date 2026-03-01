import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientsRepository } from './repository/clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { PaginatedResponse } from '@shared/types';

@Injectable()
export class ClientsService {
  constructor(private readonly repo: ClientsRepository) {}

  async create(dto: CreateClientDto) {
    const existing = await this.repo.findByTelegramId(dto.telegramId);
    if (existing) throw new ConflictException('Client with this telegramId already exists');

    return this.repo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      telegramId: dto.telegramId,
      phone: dto.phone,
    });
  }

  async findAll(query: QueryClientDto): Promise<PaginatedResponse<any>> {
    const [data, total] = await Promise.all([
      this.repo.findWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        blocked: query.blocked,
      }),
      this.repo.countAll({ search: query.search, blocked: query.blocked }),
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

  async findOne(id: string) {
    const client = await this.repo.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.repo.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    return this.repo.update(id, dto);
  }

  async softDelete(id: string) {
    const client = await this.repo.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    return this.repo.softDelete(id);
  }

  async toggleBlock(id: string) {
    const client = await this.repo.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    return this.repo.update(id, {
      blockedAt: client.blockedAt ? null : new Date(),
    });
  }
}
