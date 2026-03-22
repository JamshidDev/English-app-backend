import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';

export class UpdateCollectionDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

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

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}
