import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { QueryVocabularyDto } from './dto/query-vocabulary.dto';
import { VocabularyApiResponseDto } from './dto/vocabulary-response.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';

@ApiTags('Vocabulary')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly service: VocabularyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get words by collection',
    description: "CollectionId bo'yicha barcha so'zlarni qaytaradi.",
  })
  @ApiOkResponse({ type: VocabularyApiResponseDto })
  async findByCollectionId(@Query() query: QueryVocabularyDto) {
    return this.service.findByCollectionId(query.collectionId);
  }
}
