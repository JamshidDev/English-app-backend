import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto, PaginationMetaDto } from '../../categories/dto/category-response.dto';

export class ClientCategoryItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  clientId: string;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: CategoryResponseDto })
  category: CategoryResponseDto;
}

export class ClientCategoryListApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [ClientCategoryItemDto] })
  data: ClientCategoryItemDto[];

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class CategoryPaginatedDataDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class MyCategoresApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    description: 'Client categories list (if selected) or paginated public categories (if not selected)',
  })
  data: ClientCategoryItemDto[] | CategoryPaginatedDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
