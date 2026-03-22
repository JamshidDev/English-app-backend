import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface BackupJob {
  id: string;
  type: 'database' | 'files';
  status: 'pending' | 'running' | 'done' | 'error';
  fileName?: string;
  error?: string;
  startedAt: Date;
  finishedAt?: Date;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private jobs: BackupJob[] = [];

  constructor(private readonly configService: ConfigService) {}

  startDatabaseDump(): BackupJob {
    const job: BackupJob = {
      id: `db-${Date.now()}`,
      type: 'database',
      status: 'running',
      startedAt: new Date(),
    };
    this.jobs.unshift(job);

    this.runDatabaseDump(job);
    return job;
  }

  startFilesDump(): BackupJob {
    const job: BackupJob = {
      id: `files-${Date.now()}`,
      type: 'files',
      status: 'running',
      startedAt: new Date(),
    };
    this.jobs.unshift(job);

    this.runFilesDump(job);
    return job;
  }

  private runDatabaseDump(job: BackupJob) {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `db-dump-${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);

    const host = this.configService.get('ADMIN_DB_HOST', 'localhost');
    const port = this.configService.get('ADMIN_DB_PORT', '5432');
    const user = this.configService.get('ADMIN_DB_USER', 'postgres');
    const password = this.configService.get('ADMIN_DB_PASSWORD', '');
    const dbName = this.configService.get('ADMIN_DB_NAME', 'easy_english');

    const env = { ...process.env, PGPASSWORD: password };

    exec(
      `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbName} --no-owner --no-acl -F p -f "${filePath}"`,
      { env, timeout: 120000 },
      (error) => {
        if (error) {
          job.status = 'error';
          job.error = error.message;
          this.logger.error(`Database dump failed: ${error.message}`);
        } else {
          job.status = 'done';
          job.fileName = fileName;
          this.logger.log(`Database dump created: ${fileName}`);
        }
        job.finishedAt = new Date();
      },
    );
  }

  private runFilesDump(job: BackupJob) {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      job.status = 'error';
      job.error = 'Uploads papkasi topilmadi';
      job.finishedAt = new Date();
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `files-dump-${timestamp}.tar.gz`;
    const filePath = path.join(backupDir, fileName);

    exec(
      `tar -czf "${filePath}" -C "${process.cwd()}" uploads`,
      { timeout: 300000 },
      (error) => {
        if (error) {
          job.status = 'error';
          job.error = error.message;
          this.logger.error(`Files dump failed: ${error.message}`);
        } else {
          job.status = 'done';
          job.fileName = fileName;
          this.logger.log(`Files dump created: ${fileName}`);
        }
        job.finishedAt = new Date();
      },
    );
  }

  getJobs(): BackupJob[] {
    return this.jobs.slice(0, 10);
  }

  async listBackups(): Promise<{ name: string; size: number; date: string; type: string }[]> {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) return [];

    const files = fs.readdirSync(backupDir);
    return files
      .filter(f => f.endsWith('.sql') || f.endsWith('.tar.gz'))
      .map(f => {
        const stats = fs.statSync(path.join(backupDir, f));
        return {
          name: f,
          size: stats.size,
          date: stats.mtime.toISOString(),
          type: f.endsWith('.sql') ? 'database' : 'files',
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getBackupFilePath(fileName: string): string | null {
    const filePath = path.join(process.cwd(), 'backups', fileName);
    if (fs.existsSync(filePath)) return filePath;
    return null;
  }

  async deleteBackup(fileName: string): Promise<boolean> {
    const filePath = this.getBackupFilePath(fileName);
    if (!filePath) return false;
    fs.unlinkSync(filePath);
    return true;
  }
}
