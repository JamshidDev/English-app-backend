import { Module } from '@nestjs/common';
import { AdminNotificationsService } from './notifications.service';
import { AdminNotificationsController } from './notifications.controller';
import { AdminNotificationsRepository } from './repository/notifications.repository';

@Module({
  controllers: [AdminNotificationsController],
  providers: [AdminNotificationsService, AdminNotificationsRepository],
})
export class AdminNotificationsModule {}
