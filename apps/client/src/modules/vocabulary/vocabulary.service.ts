import { Injectable } from '@nestjs/common';
import { VocabularyRepository } from './repository/vocabulary.repository';

@Injectable()
export class VocabularyService {
  constructor(private readonly repo: VocabularyRepository) {}

  async findByCollectionId(collectionId: string) {
    return this.repo.findByCollectionId(collectionId);
  }
}
