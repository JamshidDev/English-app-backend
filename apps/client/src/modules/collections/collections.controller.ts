import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { CollectionPaginatedApiResponseDto } from './dto/collection-response.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get public collections by category with stars',
    description: 'Returns public collections with word count and star status per module.',
  })
  @ApiOkResponse({ type: CollectionPaginatedApiResponseDto })
  async findByCategoryId(
    @GetCurrentClient() client: CurrentClient,
    @Query() query: QueryCollectionDto,
  ) {
    return this.service.findByCategoryId(query, client.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }
}
