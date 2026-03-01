import { Module } from '@nestjs/common';
import { ClientCategoriesService } from './client-categories.service';
import { ClientCategoriesController } from './client-categories.controller';
import { ClientCategoriesRepository } from './repository/client-categories.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ClientCategoriesController],
  providers: [ClientCategoriesService, ClientCategoriesRepository],
})
export class ClientCategoriesModule {}
