import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateClientCategoryDto {
  @ApiProperty({ example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
