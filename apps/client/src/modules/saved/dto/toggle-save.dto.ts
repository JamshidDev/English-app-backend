import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleSaveWordDto {
  @ApiProperty()
  @IsUUID()
  wordId: string;
}
