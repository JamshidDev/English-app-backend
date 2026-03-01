import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PagePaginationDto } from '@shared/common/dto/cursor-pagination.dto';

export class QueryWordDto extends PagePaginationDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  collectionId?: string;
}
