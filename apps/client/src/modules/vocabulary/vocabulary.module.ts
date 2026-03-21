import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyRepository } from './repository/vocabulary.repository';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [ScoresModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyRepository],
})
export class VocabularyModule {}
