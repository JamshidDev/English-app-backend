import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class TranslatedFieldDto {
  @ApiProperty({ example: "To'plam 1" })
  uz: string;

  @ApiProperty({ example: 'Коллекция 1' })
  ru: string;

}

export class CollectionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: TranslatedFieldDto })
  name: TranslatedFieldDto;

  @ApiProperty({ example: 21 })
  wordCount: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
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
