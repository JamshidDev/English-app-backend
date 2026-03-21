import { IsUUID, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty()
  @IsUUID()
  wordId: string;

  @ApiProperty()
  @IsUUID()
  collectionId: string;

  @ApiProperty({ enum: ['learn', 'quiz', 'writing'] })
  @IsString()
  @IsIn(['learn', 'quiz', 'writing'])
  page: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
