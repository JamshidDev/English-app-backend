import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartWritingDto {
  @ApiProperty()
  @IsUUID()
  collectionId: string;
}
