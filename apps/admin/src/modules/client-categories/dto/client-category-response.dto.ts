import { ApiProperty } from '@nestjs/swagger';

export class ClientCategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  clientId: string;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
}

export class ClientCategoryApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ClientCategoryResponseDto })
  data: ClientCategoryResponseDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class ClientCategoryListApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [ClientCategoryResponseDto] })
  data: ClientCategoryResponseDto[];

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
