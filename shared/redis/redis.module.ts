import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
  host: string;
  port: number;
  password?: string;
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: RedisService,
          useFactory: () => {
            return new RedisService(
              options.host,
              options.port,
              options.password,
            );
          },
        },
      ],
      exports: [RedisService],
    };
  }
}
