import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LearnWordDto {
  @ApiProperty()
  @IsUUID()
  wordId: string;

  @ApiProperty()
  @IsUUID()
  collectionId: string;
}
