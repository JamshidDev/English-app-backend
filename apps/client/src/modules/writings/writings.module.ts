import { Module } from '@nestjs/common';
import { WritingsService } from './writings.service';
import { WritingsController } from './writings.controller';
import { WritingsRepository } from './repository/writings.repository';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [ScoresModule],
  controllers: [WritingsController],
  providers: [WritingsService, WritingsRepository],
})
export class WritingsModule {}
