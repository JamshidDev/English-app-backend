import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class WordResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  collectionId: string;

  @ApiProperty({ example: 'afraid' })
  word: string;

  @ApiProperty({ type: TranslatedFieldDto })
  wordTranslate: TranslatedFieldDto;

  @ApiPropertyOptional({ example: '/əˈfreɪd/' })
  transcription: string | null;

  @ApiPropertyOptional({ example: 'The woman was afraid of what she saw.' })
  example: string | null;

  @ApiPropertyOptional({ type: TranslatedFieldDto, nullable: true })
  exampleTranslate: TranslatedFieldDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  deletedAt: string | null;
}

export class WordApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: WordResponseDto })
  data: WordResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class WordPaginatedDataDto {
  @ApiProperty({ type: [WordResponseDto] })
  data: WordResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class WordPaginatedApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: WordPaginatedDataDto })
  data: WordPaginatedDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
