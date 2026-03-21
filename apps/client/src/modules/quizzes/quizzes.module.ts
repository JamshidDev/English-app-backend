import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesRepository } from './repository/quizzes.repository';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [ScoresModule],
  controllers: [QuizzesController],
  providers: [QuizzesService, QuizzesRepository],
})
export class QuizzesModule {}
