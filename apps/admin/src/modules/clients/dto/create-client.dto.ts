import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @ApiPropertyOptional({ example: 'Valiyev' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  telegramId: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
