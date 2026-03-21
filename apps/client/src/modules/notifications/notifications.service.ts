import { Injectable } from '@nestjs/common';
import { ClientNotificationsRepository } from './repository/notifications.repository';

@Injectable()
export class ClientNotificationsService {
  constructor(private readonly repo: ClientNotificationsRepository) {}

  async findAll(clientId: string, page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      this.repo.findByClient(clientId, page, pageSize),
      this.repo.countByClient(clientId),
    ]);
    const pageCount = Math.ceil(total / pageSize);
    return {
      data,
      meta: { page, pageSize, total, pageCount, hasNextPage: page < pageCount, hasPreviousPage: page > 1 },
    };
  }

  async getUnreadCount(clientId: string) {
    const count = await this.repo.countUnread(clientId);
    return { count };
  }

  async markRead(id: string) {
    return this.repo.markRead(id);
  }

  async markAllRead(clientId: string) {
    await this.repo.markAllRead(clientId);
    return { message: 'Barchasi o\'qilgan deb belgilandi' };
  }

  async createNotification(data: {
    clientId?: string;
    title: string;
    message: string;
    type?: string;
    source?: string;
  }) {
    return this.repo.create(data);
  }
}
