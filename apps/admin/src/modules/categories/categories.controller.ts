import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoryApiResponseDto, CategoryPaginatedApiResponseDto } from './dto/category-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({ type: CategoryApiResponseDto })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ type: CategoryPaginatedApiResponseDto })
  async findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CategoryApiResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CategoryApiResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CategoryApiResponseDto })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.softDelete(id);
  }

  @Patch(':id/toggle-public')
  @ApiOperation({ summary: 'Toggle category public status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CategoryApiResponseDto })
  async togglePublic(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.togglePublic(id);
  }
}
