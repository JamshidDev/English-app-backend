import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientDatabaseModule } from './database/database.module';
import { RedisModule } from '@shared/redis/redis.module';
import { validateClientEnv } from '@shared/config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ClientCategoriesModule } from './modules/client-categories/client-categories.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateClientEnv,
    }),
    ClientDatabaseModule,
    RedisModule.forRoot({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    }),
    AuthModule,
    CategoriesModule,
    CollectionsModule,
    ClientCategoriesModule,
    QuizzesModule,
    VocabularyModule,
  ],
})
export class ClientModule {}
