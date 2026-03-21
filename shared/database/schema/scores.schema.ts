import { pgTable, uuid, varchar, real, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { collections } from './collections.schema';

export const scores = pgTable('scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
  type: varchar('type', { length: 20 }).notNull(), // 'vocabulary' | 'quiz' | 'writing'
  score: real('score').notNull(), // 0 | 0.5 | 1
  percentage: real('percentage').notNull(), // 0-100
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  unique('uq_scores_client_collection_type').on(table.clientId, table.collectionId, table.type),
  index('idx_scores_client_collection').on(table.clientId, table.collectionId),
]);
