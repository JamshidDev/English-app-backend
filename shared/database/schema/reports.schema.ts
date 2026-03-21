import { pgTable, uuid, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { words } from './words.schema';
import { collections } from './collections.schema';

export interface WordSnapshot {
  word: string;
  wordTranslate: { uz: string; ru: string };
  transcription: string | null;
  example: string | null;
  exampleTranslate: { uz: string; ru: string } | null;
}

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  wordId: uuid('word_id').notNull().references(() => words.id),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
  page: varchar('page', { length: 20 }).notNull(), // 'learn' | 'quiz' | 'writing'
  message: text('message').notNull(),
  wordSnapshot: jsonb('word_snapshot').$type<WordSnapshot>().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'fixed' | 'skipped'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_reports_status').on(table.status),
  index('idx_reports_client').on(table.clientId),
]);
