import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TranslatedFieldDto {
  @ApiProperty({ example: 'Hayvonlar' })
  @IsString()
  @IsNotEmpty()
  uz: string;

  @ApiProperty({ example: 'Животные' })
  @IsString()
  @IsNotEmpty()
  ru: string;
}

export class CreateCategoryDto {
  @ApiProperty({
    type: TranslatedFieldDto,
    example: { uz: 'Hayvonlar', ru: 'Животные' },
  })
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsNotEmpty()
  name: TranslatedFieldDto;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}
