import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoryPaginatedApiResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public categories' })
  @ApiOkResponse({ type: CategoryPaginatedApiResponseDto })
  async findAll(@Query() query: QueryCategoryDto) {
    return this.service.findAllPublic(query);
  }
}
