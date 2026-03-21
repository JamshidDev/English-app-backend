import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StarsDto {
  @ApiProperty() vocabulary: boolean;
  @ApiProperty() quiz: boolean;
  @ApiProperty() writing: boolean;
}

export class CollectionScoreDto {
  @ApiPropertyOptional() vocabulary: number | null;
  @ApiPropertyOptional() quiz: number | null;
  @ApiPropertyOptional() writing: number | null;
  @ApiProperty({ type: StarsDto }) stars: StarsDto;
  @ApiProperty() totalStars: number;
}

export class CollectionScoreApiResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty({ type: CollectionScoreDto }) data: CollectionScoreDto;
  @ApiProperty() timestamp: string;
}
