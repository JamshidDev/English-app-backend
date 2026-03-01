import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { WordsRepository } from './repository/words.repository';

@Module({
  controllers: [WordsController],
  providers: [WordsService, WordsRepository],
  exports: [WordsService],
})
export class WordsModule {}
