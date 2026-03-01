import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DRIZZLE,
  createDrizzleConnection,
} from '@shared/database/drizzle.helper';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDrizzleConnection({
          host: config.get<string>('CLIENT_DB_HOST', 'localhost'),
          port: config.get<number>('CLIENT_DB_PORT', 5432),
          user: config.get<string>('CLIENT_DB_USER', 'postgres'),
          password: config.get<string>('CLIENT_DB_PASSWORD', ''),
          database: config.get<string>('CLIENT_DB_NAME', 'easy_english'),
          ssl: config.get<string>('CLIENT_DB_SSL') === 'true',
        }),
    },
  ],
  exports: [DRIZZLE],
})
export class ClientDatabaseModule {}
