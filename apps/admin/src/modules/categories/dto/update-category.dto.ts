import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from './create-category.dto';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    type: TranslatedFieldDto,
    example: { uz: 'Hayvonlar', ru: 'Животные' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  name?: TranslatedFieldDto;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}
