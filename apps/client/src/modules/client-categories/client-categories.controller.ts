import {
  Controller, Get, Post, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientCategoriesService } from './client-categories.service';
import { SaveClientCategoriesDto } from './dto/save-client-categories.dto';
import { ClientCategoryListApiResponseDto } from './dto/client-category-response.dto';
import { CategoryPaginatedApiResponseDto } from '../categories/dto/category-response.dto';
import { QueryCategoryDto } from '../categories/dto/query-category.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';

@ApiTags('Client Categories')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('client-categories')
export class ClientCategoriesController {
  constructor(private readonly service: ClientCategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get my categories',
    description: 'If client has selected categories, returns them ordered. Otherwise returns all public categories with pagination.',
  })
  @ApiOkResponse({ type: CategoryPaginatedApiResponseDto, description: 'Paginated categories or client category list' })
  async getMyCategories(
    @GetCurrentClient() client: CurrentClient,
    @Query() query: QueryCategoryDto,
  ) {
    return this.service.getMyCategories(client.id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Save selected categories for client' })
  @ApiCreatedResponse({ type: ClientCategoryListApiResponseDto })
  async saveCategories(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: SaveClientCategoriesDto,
  ) {
    return this.service.saveCategories(client.id, dto);
  }
}
