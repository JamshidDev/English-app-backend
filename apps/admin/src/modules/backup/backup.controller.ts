import {
  Controller, Get, Post, Delete, Param, Res, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';

@ApiTags('Backup')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('backup')
export class BackupController {
  constructor(private readonly service: BackupService) {}

  @Post('database')
  @ApiOperation({ summary: 'Start database dump (background job)' })
  createDatabaseDump() {
    return this.service.startDatabaseDump();
  }

  @Post('files')
  @ApiOperation({ summary: 'Start files dump (background job)' })
  createFilesDump() {
    return this.service.startFilesDump();
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get backup jobs status' })
  getJobs() {
    return this.service.getJobs();
  }

  @Get('list')
  @ApiOperation({ summary: 'List all backups' })
  async listBackups() {
    return this.service.listBackups();
  }

  @Get('download/:fileName')
  @ApiOperation({ summary: 'Download a backup file' })
  async downloadBackup(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = this.service.getBackupFilePath(fileName);
    if (!filePath) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
    res.download(filePath, fileName);
  }

  @Delete(':fileName')
  @ApiOperation({ summary: 'Delete a backup file' })
  async deleteBackup(@Param('fileName') fileName: string) {
    const deleted = await this.service.deleteBackup(fileName);
    return { deleted };
  }
}
