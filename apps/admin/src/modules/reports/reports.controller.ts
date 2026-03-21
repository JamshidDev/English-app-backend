import { Controller, Get, Patch, Query, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminReportsService } from './reports.service';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { QueryReportDto } from './dto/query-report.dto';
import { FixReportDto } from './dto/fix-report.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class AdminReportsController {
  constructor(private readonly service: AdminReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha reportlar (filter: status)' })
  async findAll(@Query() query: QueryReportDto) {
    return this.service.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Report statistikasi' })
  async getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta report detaillari' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/fix')
  @ApiOperation({ summary: "So'zni tuzatish + report yakunlash" })
  async fix(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FixReportDto,
  ) {
    return this.service.fix(id, dto);
  }

  @Patch(':id/skip')
  @ApiOperation({ summary: "Noto'g'ri xabar — o'tkazib yuborish" })
  async skip(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.skip(id);
  }
}
