import { pgTable, uuid, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { words } from './words.schema';
import { collections } from './collections.schema';

export const clientWords = pgTable('client_words', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  wordId: uuid('word_id').notNull().references(() => words.id),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
  learnedAt: timestamp('learned_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('uq_client_word').on(table.clientId, table.wordId),
  index('idx_client_words_client_collection').on(table.clientId, table.collectionId),
]);
