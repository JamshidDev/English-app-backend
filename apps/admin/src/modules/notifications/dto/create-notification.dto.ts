import { IsString, IsNotEmpty, IsOptional, IsUUID, IsIn, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: ['info', 'success', 'warning'] })
  @IsOptional()
  @IsString()
  @IsIn(['info', 'success', 'warning'])
  type?: string = 'info';

  @ApiPropertyOptional({ description: 'Client ID — bo\'sh bo\'lsa hammaga yuboriladi' })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}
