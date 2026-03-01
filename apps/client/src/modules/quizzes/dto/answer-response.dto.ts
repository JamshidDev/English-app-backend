import { ApiProperty } from '@nestjs/swagger';

export class AnswerResultDto {
  @ApiProperty({ example: true, description: "Javob to'g'rimi?" })
  correct: boolean;

  @ApiProperty({ example: 1, description: "To'g'ri javob indeksi" })
  correctIndex: number;

  @ApiProperty({ example: 1, description: 'Tanlangan javob indeksi' })
  selectedIndex: number;

  @ApiProperty({ example: false, description: 'Quiz yakunlandimi?' })
  completed: boolean;

  @ApiProperty({ example: 5, description: 'Jami savollar soni' })
  totalQuestions: number;

  @ApiProperty({ example: 3, description: 'Javob berilgan savollar soni' })
  answeredQuestions: number;

  @ApiProperty({ example: 2, description: "To'g'ri javoblar soni", nullable: true })
  correctAnswers: number;
}

export class AnswerApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: AnswerResultDto })
  data: AnswerResultDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
