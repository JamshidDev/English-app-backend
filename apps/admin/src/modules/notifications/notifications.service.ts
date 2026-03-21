import { Injectable } from '@nestjs/common';
import { AdminNotificationsRepository } from './repository/notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class AdminNotificationsService {
  constructor(private readonly repo: AdminNotificationsRepository) {}

  async create(dto: CreateNotificationDto) {
    return this.repo.create({
      clientId: dto.clientId,
      title: dto.title,
      message: dto.message,
      type: dto.type || 'info',
      source: 'admin',
    });
  }

  async findAll(page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      this.repo.findAll(page, pageSize),
      this.repo.countAll(),
    ]);
    const pageCount = Math.ceil(total / pageSize);
    return {
      data,
      meta: { page, pageSize, total, pageCount, hasNextPage: page < pageCount, hasPreviousPage: page > 1 },
    };
  }
}
