import {
  pgTable,
  uuid,
  jsonb,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { categories } from './categories.schema';

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
    name: jsonb('name').$type<{ uz: string; ru: string }>().notNull(),
    public: boolean('public').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_collections_category_id').on(table.categoryId),
  ],
);
