import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { QueryVocabularyDto } from './dto/query-vocabulary.dto';
import { VocabularyApiResponseDto } from './dto/vocabulary-response.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';
import { LearnWordDto } from './dto/learn-word.dto';
import { CompleteVocabularyDto } from './dto/complete-vocabulary.dto';

@ApiTags('Vocabulary')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly service: VocabularyService) {}

  @Get()
  @ApiOperation({ summary: 'Get words by collection (with learned status)' })
  @ApiOkResponse({ type: VocabularyApiResponseDto })
  async findByCollectionId(
    @GetCurrentClient() client: CurrentClient,
    @Query() query: QueryVocabularyDto,
  ) {
    return this.service.findByCollectionId(query.collectionId, client.id);
  }

  @Post('learn')
  @ApiOperation({ summary: "So'zni bildim deb belgilash" })
  async learnWord(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: LearnWordDto,
  ) {
    return this.service.learnWord(client.id, dto.wordId, dto.collectionId);
  }

  @Post('unlearn')
  @ApiOperation({ summary: "So'zni bilmayman deb belgilash" })
  async unlearnWord(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: LearnWordDto,
  ) {
    await this.service.unlearnWord(client.id, dto.wordId, dto.collectionId);
    return { success: true };
  }

  @Post('complete')
  @ApiOperation({ summary: "Vocabulary'ni yakunlash va ball olish" })
  async completeVocabulary(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: CompleteVocabularyDto,
  ) {
    return this.service.completeVocabulary(client.id, dto.collectionId);
  }
}
