import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { CollectionPaginatedApiResponseDto } from './dto/collection-response.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get public collections by category',
    description: 'Returns public collections for a given categoryId with pagination and word count.',
  })
  @ApiOkResponse({ type: CollectionPaginatedApiResponseDto })
  async findByCategoryId(@Query() query: QueryCollectionDto) {
    return this.service.findByCategoryId(query);
  }
}
