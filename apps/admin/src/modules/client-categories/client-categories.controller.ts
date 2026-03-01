import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ClientCategoriesService } from './client-categories.service';
import { CreateClientCategoryDto } from './dto/create-client-category.dto';
import { ReorderClientCategoriesDto } from './dto/reorder-client-categories.dto';
import { ClientCategoryApiResponseDto, ClientCategoryListApiResponseDto } from './dto/client-category-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';

@ApiTags('Client Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client-categories')
export class ClientCategoriesController {
  constructor(private readonly service: ClientCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a category to a client' })
  @ApiCreatedResponse({ type: ClientCategoryApiResponseDto })
  async create(@Body() dto: CreateClientCategoryDto) {
    return this.service.create(dto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all categories of a client (ordered)' })
  @ApiParam({ name: 'clientId', format: 'uuid' })
  @ApiOkResponse({ type: ClientCategoryListApiResponseDto })
  async findByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.service.findByClientId(clientId);
  }

  @Put('client/:clientId/reorder')
  @ApiOperation({ summary: 'Reorder categories for a client' })
  @ApiParam({ name: 'clientId', format: 'uuid' })
  @ApiOkResponse({ type: ClientCategoryListApiResponseDto })
  async reorder(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() dto: ReorderClientCategoriesDto,
  ) {
    return this.service.reorder(clientId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a category from a client' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ClientCategoryApiResponseDto })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
