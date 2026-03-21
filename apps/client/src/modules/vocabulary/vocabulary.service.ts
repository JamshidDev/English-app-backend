import { Injectable } from '@nestjs/common';
import { VocabularyRepository } from './repository/vocabulary.repository';
import { ScoresService } from '../scores/scores.service';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly repo: VocabularyRepository,
    private readonly scoresService: ScoresService,
  ) {}

  async findByCollectionId(collectionId: string, clientId: string) {
    return this.repo.findByCollectionIdWithLearned(collectionId, clientId);
  }

  async learnWord(clientId: string, wordId: string, collectionId: string) {
    return this.repo.markWordAsLearned(clientId, wordId, collectionId);
  }

  async unlearnWord(clientId: string, wordId: string) {
    return this.repo.unmarkWordAsLearned(clientId, wordId);
  }

  async completeVocabulary(clientId: string, collectionId: string) {
    const learned = await this.repo.countLearnedByCollection(clientId, collectionId);
    const total = await this.repo.countTotalByCollection(collectionId);

    await this.scoresService.saveScore(clientId, collectionId, 'vocabulary', learned, total);

    const percentage = total > 0 ? (learned / total) * 100 : 0;
    return {
      learned,
      total,
      percentage: Math.round(percentage),
      score: this.scoresService.calculateScore(percentage),
    };
  }
}
