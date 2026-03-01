import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';

export class UpdateWordDto {
  @ApiPropertyOptional({ example: 'apple' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  word?: string;

  @ApiPropertyOptional({ type: TranslatedFieldDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  wordTranslate?: TranslatedFieldDto;

  @ApiPropertyOptional({ example: '/ˈæp.əl/' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transcription?: string;

  @ApiPropertyOptional({ example: 'I eat an apple every day.' })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiPropertyOptional({ type: TranslatedFieldDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  exampleTranslate?: TranslatedFieldDto;
}
