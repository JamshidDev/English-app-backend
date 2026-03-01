import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuizOptionDto {
  @ApiProperty({ format: 'uuid' })
  wordId: string;

  @ApiProperty({ example: { uz: "qo'rqmoq", ru: 'бояться' } })
  wordTranslate: { uz: string; ru: string };
}

export class QuizQuestionDto {
  @ApiProperty({ format: 'uuid' })
  wordId: string;

  @ApiProperty({ example: 'afraid' })
  word: string;

  @ApiPropertyOptional({ example: '/əˈfreɪd/', nullable: true })
  transcription: string | null;

  @ApiProperty({ type: [QuizOptionDto] })
  options: QuizOptionDto[];

  @ApiProperty({ example: 1, description: "To'g'ri javob indeksi (0-3)" })
  correctIndex: number;
}

export class QuizResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  clientId: string;

  @ApiProperty({ format: 'uuid' })
  collectionId: string;

  @ApiProperty({ type: [QuizQuestionDto] })
  questions: QuizQuestionDto[];

  @ApiProperty({ example: 21 })
  totalQuestions: number;

  @ApiPropertyOptional({ example: null, nullable: true })
  correctAnswers: number | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  completedAt: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
}

export class QuizApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: QuizResponseDto })
  data: QuizResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
