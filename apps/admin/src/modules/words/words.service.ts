import { Injectable, NotFoundException } from '@nestjs/common';
import { WordsRepository } from './repository/words.repository';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { QueryWordDto } from './dto/query-word.dto';
import { PaginatedResponse } from '@shared/types';

@Injectable()
export class WordsService {
  constructor(private readonly repo: WordsRepository) {}

  async create(dto: CreateWordDto) {
    return this.repo.create({
      collectionId: dto.collectionId,
      word: dto.word,
      wordTranslate: dto.wordTranslate,
      transcription: dto.transcription,
      example: dto.example,
      exampleTranslate: dto.exampleTranslate,
    });
  }

  async findAll(query: QueryWordDto): Promise<PaginatedResponse<any>> {
    const [data, total] = await Promise.all([
      this.repo.findWithPagination({
        page: query.page,
        pageSize: query.pageSize,
        search: query.search,
        collectionId: query.collectionId,
      }),
      this.repo.countAll({ search: query.search, collectionId: query.collectionId }),
    ]);

    const pageCount = Math.ceil(total / query.pageSize);

    return {
      data,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        pageCount,
        hasNextPage: query.page < pageCount,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async findOne(id: string) {
    const word = await this.repo.findById(id);
    if (!word) throw new NotFoundException('Word not found');
    return word;
  }

  async update(id: string, dto: UpdateWordDto) {
    const word = await this.repo.findById(id);
    if (!word) throw new NotFoundException('Word not found');
    return this.repo.update(id, dto);
  }

  async softDelete(id: string) {
    const word = await this.repo.findById(id);
    if (!word) throw new NotFoundException('Word not found');
    return this.repo.softDelete(id);
  }
}
