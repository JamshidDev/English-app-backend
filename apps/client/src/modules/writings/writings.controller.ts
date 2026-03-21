import { Controller, Post, Get, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WritingsService } from './writings.service';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';
import { StartWritingDto } from './dto/start-writing.dto';
import { SubmitWritingAnswerDto } from './dto/submit-writing-answer.dto';
import { WritingApiResponseDto } from './dto/writing-response.dto';

@ApiTags('Writings')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('writings')
export class WritingsController {
  constructor(private readonly writingsService: WritingsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start writing session' })
  @ApiResponse({ status: 201, type: WritingApiResponseDto })
  async start(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: StartWritingDto,
  ) {
    return this.writingsService.start(client.id, dto.collectionId);
  }

  @Get('collection/:collectionId')
  @ApiOperation({ summary: 'Get active writing session' })
  @ApiResponse({ status: 200, type: WritingApiResponseDto })
  async findByCollectionId(
    @GetCurrentClient() client: CurrentClient,
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
  ) {
    return this.writingsService.findByCollectionId(client.id, collectionId);
  }

  @Post(':writingId/answer')
  @ApiOperation({ summary: 'Submit writing answer' })
  @ApiResponse({ status: 200, type: WritingApiResponseDto })
  async submitAnswer(
    @GetCurrentClient() client: CurrentClient,
    @Param('writingId', ParseUUIDPipe) writingId: string,
    @Body() dto: SubmitWritingAnswerDto,
  ) {
    return this.writingsService.submitAnswer(client.id, writingId, dto.wordId, dto.answer);
  }

  @Post(':writingId/complete')
  @ApiOperation({ summary: 'Complete writing session' })
  @ApiResponse({ status: 200, type: WritingApiResponseDto })
  async complete(
    @GetCurrentClient() client: CurrentClient,
    @Param('writingId', ParseUUIDPipe) writingId: string,
  ) {
    return this.writingsService.complete(client.id, writingId);
  }
}
