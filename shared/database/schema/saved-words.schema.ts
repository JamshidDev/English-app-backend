import { pgTable, uuid, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { words } from './words.schema';

export const savedWords = pgTable('saved_words', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  wordId: uuid('word_id').notNull().references(() => words.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('uq_saved_word').on(table.clientId, table.wordId),
  index('idx_saved_words_client').on(table.clientId),
]);
