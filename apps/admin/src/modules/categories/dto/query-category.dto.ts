import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PagePaginationDto } from '@shared/common/dto/cursor-pagination.dto';

export class QueryCategoryDto extends PagePaginationDto {
  @ApiPropertyOptional({ description: 'Filter by public status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  public?: boolean;
}
