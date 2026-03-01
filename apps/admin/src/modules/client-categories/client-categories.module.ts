import { Module } from '@nestjs/common';
import { ClientCategoriesService } from './client-categories.service';
import { ClientCategoriesController } from './client-categories.controller';
import { ClientCategoriesRepository } from './repository/client-categories.repository';

@Module({
  controllers: [ClientCategoriesController],
  providers: [ClientCategoriesService, ClientCategoriesRepository],
  exports: [ClientCategoriesService],
})
export class ClientCategoriesModule {}
