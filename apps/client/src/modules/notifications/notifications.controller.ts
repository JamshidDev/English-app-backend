import { Controller, Get, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientNotificationsService } from './notifications.service';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';
import { QueryNotificationDto } from './dto/query-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('notifications')
export class ClientNotificationsController {
  constructor(private readonly service: ClientNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Xabarlar ro\'yxati' })
  async findAll(
    @GetCurrentClient() client: CurrentClient,
    @Query() query: QueryNotificationDto,
  ) {
    return this.service.findAll(client.id, query.page, query.pageSize);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'O\'qilmagan xabarlar soni' })
  async getUnreadCount(@GetCurrentClient() client: CurrentClient) {
    return this.service.getUnreadCount(client.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Xabarni o\'qilgan deb belgilash' })
  async markRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.markRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Barchasini o\'qilgan qilish' })
  async markAllRead(@GetCurrentClient() client: CurrentClient) {
    return this.service.markAllRead(client.id);
  }
}
