import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('weekly-activity')
  @ApiOperation({ summary: 'Get weekly user activity' })
  async getWeeklyActivity() {
    return this.service.getWeeklyActivity();
  }

  @Get('top-collections')
  @ApiOperation({ summary: 'Get top collections by quiz count' })
  async getTopCollections() {
    return this.service.getTopCollections();
  }

  @Get('recent-clients')
  @ApiOperation({ summary: 'Get recently registered clients' })
  async getRecentClients() {
    return this.service.getRecentClients();
  }
}
