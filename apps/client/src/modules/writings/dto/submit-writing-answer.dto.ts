import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitWritingAnswerDto {
  @ApiProperty()
  @IsUUID()
  wordId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;
}
