import { IsOptional, IsString, IsObject, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FixReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  word?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  wordTranslate?: { uz: string; ru: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transcription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  example?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  exampleTranslate?: { uz: string; ru: string };
}
