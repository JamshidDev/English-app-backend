import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class QueryVocabularyDto {
  @ApiProperty({ format: 'uuid', description: 'Collection ID' })
  @IsNotEmpty()
  @IsUUID()
  collectionId: string;
}
