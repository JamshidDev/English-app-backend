import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PagePaginationDto } from '@shared/common/dto/cursor-pagination.dto';

export class QueryCollectionDto extends PagePaginationDto {
  @ApiProperty({ format: 'uuid', description: 'Category ID' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
