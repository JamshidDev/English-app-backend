import { Injectable } from '@nestjs/common';
import { SavedRepository } from './repository/saved.repository';

@Injectable()
export class SavedService {
  constructor(private readonly repo: SavedRepository) {}

  async toggleSaveWord(clientId: string, wordId: string) {
    const isSaved = await this.repo.isWordSaved(clientId, wordId);
    if (isSaved) {
      await this.repo.unsaveWord(clientId, wordId);
      return { saved: false };
    }
    await this.repo.saveWord(clientId, wordId);
    return { saved: true };
  }

  async getSavedWords(clientId: string, page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      this.repo.getSavedWords(clientId, page, pageSize),
      this.repo.countSavedWords(clientId),
    ]);
    const pageCount = Math.ceil(total / pageSize);
    return {
      data,
      meta: { page, pageSize, total, pageCount, hasNextPage: page < pageCount, hasPreviousPage: page > 1 },
    };
  }

  async getSavedCounts(clientId: string) {
    const wordsCount = await this.repo.countSavedWords(clientId);
    return { words: wordsCount };
  }
}
