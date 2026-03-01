import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TranslatedFieldDto {
  @ApiProperty({ example: "qo'rqmoq" })
  uz: string;

  @ApiProperty({ example: 'бояться' })
  ru: string;
}

export class VocabularyItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'afraid' })
  word: string;

  @ApiProperty({ type: TranslatedFieldDto })
  wordTranslate: TranslatedFieldDto;

  @ApiPropertyOptional({ example: '/əˈfreɪd/', nullable: true })
  transcription: string | null;

  @ApiPropertyOptional({ example: 'I am afraid of spiders.', nullable: true })
  example: string | null;

  @ApiPropertyOptional({ type: TranslatedFieldDto, nullable: true })
  exampleTranslate: TranslatedFieldDto | null;
}

export class VocabularyApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [VocabularyItemDto] })
  data: VocabularyItemDto[];

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
