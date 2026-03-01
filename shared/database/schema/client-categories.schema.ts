import {
  pgTable,
  uuid,
  integer,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { categories } from './categories.schema';

export const clientCategories = pgTable(
  'client_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('idx_client_categories_client_id').on(table.clientId),
    unique('uq_client_category').on(table.clientId, table.categoryId),
  ],
);
