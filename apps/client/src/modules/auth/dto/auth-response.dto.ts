import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientInfoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Ali' })
  firstName: string;

  @ApiProperty({ example: 'Valiyev', nullable: true })
  lastName: string | null;

  @ApiProperty({ example: '123456789' })
  telegramId: string;
}

export class ClientLoginDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ type: ClientInfoDto })
  client: ClientInfoDto;
}

export class ClientLoginApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ClientLoginDataDto })
  data: ClientLoginDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class ClientCheckDataDto {
  @ApiProperty({ example: true, description: "Ro'yxatdan o'tganmi?" })
  registered: boolean;

  @ApiPropertyOptional({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken?: string;

  @ApiPropertyOptional({ type: ClientInfoDto })
  client?: ClientInfoDto;
}

export class ClientCheckApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ClientCheckDataDto })
  data: ClientCheckDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
