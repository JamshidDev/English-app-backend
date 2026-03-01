import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ format: 'uuid', description: "Savol so'zining ID'si" })
  @IsNotEmpty()
  @IsUUID()
  wordId: string;

  @ApiProperty({ example: 1, description: 'Tanlangan javob indeksi (0-3)', minimum: 0, maximum: 3 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(3)
  selectedIndex: number;
}
