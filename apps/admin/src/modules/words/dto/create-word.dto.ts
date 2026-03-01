import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from '../../categories/dto/create-category.dto';

export class CreateWordDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  collectionId: string;

  @ApiProperty({ example: 'apple' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  word: string;

  @ApiProperty({
    type: TranslatedFieldDto,
    example: { uz: 'olma', ru: 'яблоко' },
  })
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  @IsNotEmpty()
  wordTranslate: TranslatedFieldDto;

  @ApiPropertyOptional({ example: '/ˈæp.əl/' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transcription?: string;

  @ApiPropertyOptional({ example: 'I eat an apple every day.' })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiPropertyOptional({
    type: TranslatedFieldDto,
    example: { uz: 'Men har kuni olma yeyman.', ru: 'Я ем яблоко каждый день.' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  exampleTranslate?: TranslatedFieldDto;
}
