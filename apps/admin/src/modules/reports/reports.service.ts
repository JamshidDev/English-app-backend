import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { AdminReportsRepository } from './repository/reports.repository';
import { QueryReportDto } from './dto/query-report.dto';
import { FixReportDto } from './dto/fix-report.dto';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { notifications } from '@shared/database/schema';

@Injectable()
export class AdminReportsService {
  constructor(
    private readonly repo: AdminReportsRepository,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  async findAll(query: QueryReportDto) {
    const [data, total] = await Promise.all([
      this.repo.findWithPagination({
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      }),
      this.repo.countAll(query.status),
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

  async findById(id: string) {
    const report = await this.repo.findById(id);
    if (!report) throw new NotFoundException('Report topilmadi');
    return report;
  }

  async fix(id: string, dto: FixReportDto) {
    const report = await this.repo.findById(id);
    if (!report) throw new NotFoundException('Report topilmadi');

    // So'zni yangilash
    const updateData: Record<string, any> = {};
    if (dto.word !== undefined) updateData.word = dto.word;
    if (dto.wordTranslate !== undefined) updateData.wordTranslate = dto.wordTranslate;
    if (dto.transcription !== undefined) updateData.transcription = dto.transcription;
    if (dto.example !== undefined) updateData.example = dto.example;
    if (dto.exampleTranslate !== undefined) updateData.exampleTranslate = dto.exampleTranslate;

    if (Object.keys(updateData).length > 0) {
      await this.repo.updateWord(report.wordId, updateData);
    }

    // Report statusini fixed ga o'zgartirish
    await this.repo.updateStatus(id, 'fixed');

    // Clientga notification yuborish
    await this.db.insert(notifications).values({
      clientId: report.clientId,
      title: "So'z tuzatildi",
      message: `"${report.wordSnapshot.word}" so'zidagi xatolik tuzatildi. Rahmat!`,
      type: 'success',
      source: 'system',
    });

    return { message: "So'z tuzatildi va report yakunlandi" };
  }

  async skip(id: string) {
    const report = await this.repo.findById(id);
    if (!report) throw new NotFoundException('Report topilmadi');

    await this.repo.updateStatus(id, 'skipped');
    return { message: 'Report o\'tkazib yuborildi' };
  }

  async getStats() {
    return this.repo.getStats();
  }
}
