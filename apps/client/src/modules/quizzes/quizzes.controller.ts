import { Controller, Post, Get, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { QuizApiResponseDto } from './dto/quiz-response.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AnswerApiResponseDto } from './dto/answer-response.dto';
import { ClientJwtAuthGuard } from '../auth/guards/client-jwt-auth.guard';
import { GetCurrentClient } from '../auth/decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(ClientJwtAuthGuard)
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly service: QuizzesService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate quiz from collection words',
    description: "CollectionId bo'yicha barcha so'zlardan quiz generatsiya qiladi. Agar tugatilmagan quiz mavjud bo'lsa, yangi generatsiya qilmaydi.",
  })
  @ApiCreatedResponse({ type: QuizApiResponseDto })
  async generate(
    @GetCurrentClient() client: CurrentClient,
    @Body() dto: GenerateQuizDto,
  ) {
    return this.service.generate(client.id, dto);
  }

  @Get('collection/:collectionId')
  @ApiOperation({
    summary: 'Get active quiz by collection',
    description: "Collection uchun tugatilmagan (active) quizni qaytaradi. Agar tugatilmagan quiz yo'q bo'lsa, null qaytaradi.",
  })
  @ApiParam({ name: 'collectionId', format: 'uuid' })
  @ApiOkResponse({ type: QuizApiResponseDto })
  async findByCollectionId(
    @GetCurrentClient() client: CurrentClient,
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
  ) {
    return this.service.findByCollectionId(client.id, collectionId);
  }

  @Post(':quizId/answer')
  @ApiOperation({
    summary: 'Submit answer for a quiz question',
    description: "Savolga javob berish. Javob to'g'ri yoki noto'g'ri ekanini qaytaradi. Barcha savollarga javob berilganda quiz avtomatik yakunlanadi.",
  })
  @ApiParam({ name: 'quizId', format: 'uuid' })
  @ApiOkResponse({ type: AnswerApiResponseDto })
  async submitAnswer(
    @GetCurrentClient() client: CurrentClient,
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.service.submitAnswer(client.id, quizId, dto);
  }

  @Post(':quizId/complete')
  @ApiOperation({
    summary: 'Complete a quiz',
    description: "Quizni yakunlash. Barcha savollarga javob berilmagan bo'lsa ham quizni tugatadi.",
  })
  @ApiParam({ name: 'quizId', format: 'uuid' })
  @ApiOkResponse()
  async complete(
    @GetCurrentClient() client: CurrentClient,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ) {
    return this.service.complete(client.id, quizId);
  }
}
