import { ApiProperty } from '@nestjs/swagger';

export class AdminInfoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'superadmin' })
  username: string;

  @ApiProperty({ example: 'superadmin@easyenglish.com' })
  email: string;

  @ApiProperty({ example: 'super_admin', enum: ['admin', 'super_admin'] })
  role: string;

  @ApiProperty({ example: 'Super Admin' })
  fullName: string;
}

export class LoginDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ type: AdminInfoDto })
  admin: AdminInfoDto;
}

export class LoginApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: LoginDataDto })
  data: LoginDataDto;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
