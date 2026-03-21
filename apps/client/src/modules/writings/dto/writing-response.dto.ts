import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WritingAnswerResultDto {
  @ApiProperty() correct: boolean;
  @ApiProperty() correctWord: string;
  @ApiProperty() answer: string;
  @ApiProperty() completed: boolean;
  @ApiProperty() totalQuestions: number;
  @ApiProperty() answeredQuestions: number;
  @ApiProperty() correctAnswers: number;
}

export class WritingCompleteResultDto {
  @ApiProperty() totalQuestions: number;
  @ApiProperty() answeredQuestions: number;
  @ApiProperty() correctAnswers: number;
}

export class WritingApiResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() data: any;
  @ApiProperty() timestamp: string;
}
