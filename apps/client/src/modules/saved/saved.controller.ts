import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SavedService } from './saved.service';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';
import { ToggleSaveWordDto } from './dto/toggle-save.dto';
import { QuerySavedDto } from './dto/query-saved.dto';

@ApiTags('Saved')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private readonly service: SavedService) {}

  @Post('words/toggle')
  @ApiOperation({ summary: "So'zni saqlash/o'chirish" })
  async toggleWord(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: ToggleSaveWordDto,
  ) {
    return this.service.toggleSaveWord(client.id, dto.wordId);
  }

  @Get('words')
  @ApiOperation({ summary: "Saqlangan so'zlar ro'yxati" })
  async getWords(
    @GetCurrentClient() client: CurrentClient,
    @Query() query: QuerySavedDto,
  ) {
    return this.service.getSavedWords(client.id, query.page, query.pageSize);
  }

  @Get('counts')
  @ApiOperation({ summary: 'Saqlangan sonlar' })
  async getCounts(@GetCurrentClient() client: CurrentClient) {
    return this.service.getSavedCounts(client.id);
  }
}
