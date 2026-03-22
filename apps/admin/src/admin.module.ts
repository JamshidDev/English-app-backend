import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminDatabaseModule } from './database/database.module';
import { RedisModule } from '@shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { WordsModule } from './modules/words/words.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ClientCategoriesModule } from './modules/client-categories/client-categories.module';
import { AdminReportsModule } from './modules/reports/reports.module';
import { AdminNotificationsModule } from './modules/notifications/notifications.module';
import { BackupModule } from './modules/backup/backup.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { validateAdminEnv } from '@shared/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validate: validateAdminEnv,
    }),
    AdminDatabaseModule,
    RedisModule.forRoot({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    }),
    AuthModule,
    CategoriesModule,
    CollectionsModule,
    WordsModule,
    ClientsModule,
    ClientCategoriesModule,
    AdminReportsModule,
    AdminNotificationsModule,
    BackupModule,
    DashboardModule,
  ],
})
export class AdminModule {}
