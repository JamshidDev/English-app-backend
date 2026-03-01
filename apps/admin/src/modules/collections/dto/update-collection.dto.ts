import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';

export class UpdateCollectionDto {
  @ApiPropertyOptional({
    type: TranslatedFieldDto,
    example: { uz: 'Ranglar', ru: 'Цвета' },
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
