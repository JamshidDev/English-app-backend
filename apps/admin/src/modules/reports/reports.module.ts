import { Module } from '@nestjs/common';
import { AdminReportsService } from './reports.service';
import { AdminReportsController } from './reports.controller';
import { AdminReportsRepository } from './repository/reports.repository';

@Module({
  controllers: [AdminReportsController],
  providers: [AdminReportsService, AdminReportsRepository],
})
export class AdminReportsModule {}
