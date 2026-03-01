import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PagePaginationDto } from '@shared/common/dto/cursor-pagination.dto';

export class QueryClientDto extends PagePaginationDto {
  @ApiPropertyOptional({ description: 'Filter blocked clients' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  blocked?: boolean;
}
