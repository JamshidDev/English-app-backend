import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '@shared/common/dto/response.dto';

export class ClientResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ali' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Valiyev' })
  lastName: string | null;

  @ApiProperty({ example: '123456789' })
  telegramId: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  phone: string | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  blockedAt: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  deletedAt: string | null;
}

export class ClientApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ClientResponseDto })
  data: ClientResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class ClientPaginatedDataDto {
  @ApiProperty({ type: [ClientResponseDto] })
  data: ClientResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class ClientPaginatedApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ClientPaginatedDataDto })
  data: ClientPaginatedDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
