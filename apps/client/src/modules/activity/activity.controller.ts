import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';

@ApiTags('Activity')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Active kunlar (oy bo\'yicha)' })
  async getActiveDays(
    @GetCurrentClient() client: CurrentClient,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) || new Date().getMonth() + 1;
    const days = await this.service.getActiveDays(client.id, y, m);
    const total = await this.service.getTotalActiveDays(client.id);
    return { days, total };
  }
}
