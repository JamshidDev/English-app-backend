import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminNotificationsService } from './notifications.service';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class AdminNotificationsController {
  constructor(private readonly service: AdminNotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Xabar yuborish (clientId bo\'lmasa hammaga)' })
  async create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Yuborilgan xabarlar' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.service.findAll(Number(page), Number(pageSize));
  }
}
