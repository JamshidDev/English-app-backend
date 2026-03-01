import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { CollectionApiResponseDto, CollectionPaginatedApiResponseDto } from './dto/collection-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';

@ApiTags('Collections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiCreatedResponse({ type: CollectionApiResponseDto })
  async create(@Body() dto: CreateCollectionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collections' })
  @ApiOkResponse({ type: CollectionPaginatedApiResponseDto })
  async findAll(@Query() query: QueryCollectionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CollectionApiResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CollectionApiResponseDto })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCollectionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CollectionApiResponseDto })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.softDelete(id);
  }

  @Patch(':id/toggle-public')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CollectionApiResponseDto })
  async togglePublic(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.togglePublic(id);
  }
}
