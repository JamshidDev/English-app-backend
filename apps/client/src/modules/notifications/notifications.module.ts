import { Module } from '@nestjs/common';
import { ClientNotificationsService } from './notifications.service';
import { ClientNotificationsController } from './notifications.controller';
import { ClientNotificationsRepository } from './repository/notifications.repository';

@Module({
  controllers: [ClientNotificationsController],
  providers: [ClientNotificationsService, ClientNotificationsRepository],
  exports: [ClientNotificationsService],
})
export class ClientNotificationsModule {}
