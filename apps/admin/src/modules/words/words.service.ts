import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WordsRepository } from './repository/words.repository';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { QueryWordDto } from './dto/query-word.dto';
import { PaginatedResponse } from '@shared/types';
import { RedisService } from '@shared/redis/redis.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WordsService {
  private readonly logger = new Logger(WordsService.name);

  constructor(
    private readonly repo: WordsRepository,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {}

  private async invalidateVocabCache() {
    await this.redis.delByPattern('cache:vocab:*');
    await this.redis.delByPattern('cache:collections:*');
  }

  async create(dto: CreateWordDto) {
    const result = await this.repo.create({
      collectionId: dto.collectionId,
      word: dto.word,
      wordTranslate: dto.wordTranslate,
      transcription: dto.transcription,
      example: dto.example,
      exampleTranslate: dto.exampleTranslate,
    });
    await this.invalidateVocabCache();
    return result;
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
    const result = await this.repo.update(id, dto);
    await this.invalidateVocabCache();
    return result;
  }

  async softDelete(id: string) {
    const word = await this.repo.findById(id);
    if (!word) throw new NotFoundException('Word not found');
    const result = await this.repo.softDelete(id);
    await this.invalidateVocabCache();
    return result;
  }

  async generateSingleAudio(wordId: string) {
    const apiKey = this.configService.get<string>('GOOGLE_TTS_API_KEY');
    if (!apiKey) throw new NotFoundException('GOOGLE_TTS_API_KEY is not configured');

    const word = await this.repo.findById(wordId);
    if (!word) throw new NotFoundException('Word not found');

    const audioDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filePath = path.join(audioDir, `${word.id}.mp3`);

    // Eski faylni o'chirish (regenerate uchun)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: word.word },
          voice: { languageCode: 'en-US', name: 'en-US-Neural2-D' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 },
        }),
      },
    );

    const data = await response.json();

    if (!data.audioContent) {
      throw new NotFoundException(data.error?.message || 'Audio generatsiya xatosi');
    }

    const audioBuffer = Buffer.from(data.audioContent, 'base64');
    fs.writeFileSync(filePath, audioBuffer);

    const audioUrl = `/uploads/audio/${word.id}.mp3`;
    const updated = await this.repo.updateAudioUrl(word.id, audioUrl);

    return updated;
  }

  async generateAudio(collectionId: string) {
    const apiKey = this.configService.get<string>('GOOGLE_TTS_API_KEY');
    if (!apiKey) {
      throw new NotFoundException('GOOGLE_TTS_API_KEY is not configured');
    }

    const wordsList = await this.repo.findByCollectionId(collectionId);
    if (!wordsList.length) {
      throw new NotFoundException('No words found in this collection');
    }

    const audioDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    let generated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const word of wordsList) {
      const filePath = path.join(audioDir, `${word.id}.mp3`);

      if (fs.existsSync(filePath) && word.audioUrl) {
        skipped++;
        continue;
      }

      try {
        const response = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: { text: word.word },
              voice: {
                languageCode: 'en-US',
                name: 'en-US-Neural2-D',
              },
              audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.9,
              },
            }),
          },
        );

        const data = await response.json();

        if (data.audioContent) {
          const audioBuffer = Buffer.from(data.audioContent, 'base64');
          fs.writeFileSync(filePath, audioBuffer);

          const audioUrl = `/uploads/audio/${word.id}.mp3`;
          await this.repo.updateAudioUrl(word.id, audioUrl);
          generated++;
          this.logger.log(`Audio generated: ${word.word}`);
        } else {
          errors.push(`${word.word}: ${data.error?.message || 'No audio content'}`);
        }
      } catch (error) {
        errors.push(`${word.word}: ${error.message}`);
      }
    }

    return {
      total: wordsList.length,
      generated,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
