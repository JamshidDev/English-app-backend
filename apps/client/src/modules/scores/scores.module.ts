import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { ScoresRepository } from './repository/scores.repository';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [ScoresController],
  providers: [ScoresService, ScoresRepository],
  exports: [ScoresService],
})
export class ScoresModule {}
