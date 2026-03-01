import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClientLoginDto {
  @ApiProperty({ example: '123456789', description: 'Telegram user ID' })
  @IsString()
  @IsNotEmpty()
  telegramId: string;
}
