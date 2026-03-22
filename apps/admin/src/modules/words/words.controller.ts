import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { QueryWordDto } from './dto/query-word.dto';
import { WordApiResponseDto, WordPaginatedApiResponseDto } from './dto/word-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';

@ApiTags('Words')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('words')
export class WordsController {
  constructor(private readonly service: WordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a word' })
  @ApiCreatedResponse({ type: WordApiResponseDto })
  async create(@Body() dto: CreateWordDto) {
    return this.service.create(dto);
  }

  @Post('generate-audio')
  @ApiOperation({ summary: 'Generate audio for all words in a collection' })
  async generateAudio(@Body() body: { collectionId: string }) {
    return this.service.generateAudio(body.collectionId);
  }

  @Post(':id/generate-audio')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOperation({ summary: 'Generate or regenerate audio for a single word' })
  async generateSingleAudio(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.generateSingleAudio(id);
  }

  @Get()
  @ApiOkResponse({ type: WordPaginatedApiResponseDto })
  async findAll(@Query() query: QueryWordDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: WordApiResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: WordApiResponseDto })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWordDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: WordApiResponseDto })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.softDelete(id);
  }
}
