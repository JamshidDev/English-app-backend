import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranslatedFieldDto } from './create-category.dto';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: TranslatedFieldDto })
  name: TranslatedFieldDto;

  @ApiProperty({ example: false })
  public: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  deletedAt: string | null;
}

export class CategoryApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class CategoryPaginatedDataDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CategoryPaginatedApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: CategoryPaginatedDataDto })
  data: CategoryPaginatedDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
