import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScoresService } from './scores.service';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';
import { CollectionScoreApiResponseDto } from './dto/score-response.dto';

@ApiTags('Scores')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get total stars summary' })
  async getSummary(@GetCurrentClient() client: CurrentClient) {
    const starsMap = await this.scoresService.getStarsByClientAndCollections(client.id);
    const totalStars = Object.values(starsMap).reduce((sum, s) => sum + s.totalStars, 0);
    return { totalStars, collectionsCount: Object.keys(starsMap).length };
  }

  @Get('collection/:collectionId')
  @ApiOperation({ summary: 'Get scores for a collection' })
  @ApiResponse({ status: 200, type: CollectionScoreApiResponseDto })
  async getCollectionScores(
    @GetCurrentClient() client: CurrentClient,
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
  ) {
    return this.scoresService.getCollectionScores(client.id, collectionId);
  }
}
