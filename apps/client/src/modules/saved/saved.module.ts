import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { SavedRepository } from './repository/saved.repository';

@Module({
  controllers: [SavedController],
  providers: [SavedService, SavedRepository],
  exports: [SavedService],
})
export class SavedModule {}
