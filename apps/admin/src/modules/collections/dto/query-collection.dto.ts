import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PagePaginationDto } from '@shared/common/dto/cursor-pagination.dto';

export class QueryCollectionDto extends PagePaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  public?: boolean;
}
