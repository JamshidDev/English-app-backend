import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class TranslatedFieldResponseDto {
  @ApiProperty({ example: 'Hayvonlar' })
  uz: string;

  @ApiProperty({ example: 'Животные' })
  ru: string;

}

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: TranslatedFieldResponseDto })
  name: TranslatedFieldResponseDto;

  @ApiProperty({ example: true })
  public: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
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

export { PaginationMetaDto };
