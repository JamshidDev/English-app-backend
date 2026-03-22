import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';

export class CreateCollectionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    type: TranslatedFieldDto,
    example: { uz: 'Ranglar', ru: 'Цвета' },
  })
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsNotEmpty()
  name: TranslatedFieldDto;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}
