import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class CollectionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: TranslatedFieldDto })
  name: TranslatedFieldDto;

  @ApiProperty({ example: false })
  public: boolean;

  @ApiProperty({ example: 21 })
  wordCount: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  deletedAt: string | null;
}

export class CollectionApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CollectionResponseDto })
  data: CollectionResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class CollectionPaginatedDataDto {
  @ApiProperty({ type: [CollectionResponseDto] })
  data: CollectionResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CollectionPaginatedApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CollectionPaginatedDataDto })
  data: CollectionPaginatedDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
