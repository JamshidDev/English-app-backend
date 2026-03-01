import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class ReorderClientCategoriesDto {
  @ApiProperty({
    description: 'Category IDs in desired order',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  categoryIds: string[];
}
