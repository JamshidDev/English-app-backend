import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './repository/reports.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { WordSnapshot } from '@shared/database/schema/reports.schema';

@Injectable()
export class ReportsService {
  constructor(private readonly repo: ReportsRepository) {}

  async submitReport(clientId: string, dto: CreateReportDto) {
    const word = await this.repo.getWordById(dto.wordId);
    if (!word) throw new NotFoundException("So'z topilmadi");

    const wordSnapshot: WordSnapshot = {
      word: word.word,
      wordTranslate: word.wordTranslate as { uz: string; ru: string },
      transcription: word.transcription,
      example: word.example,
      exampleTranslate: word.exampleTranslate as { uz: string; ru: string } | null,
    };

    return this.repo.create({
      clientId,
      wordId: dto.wordId,
      collectionId: dto.collectionId,
      page: dto.page,
      message: dto.message,
      wordSnapshot,
    });
  }
}
