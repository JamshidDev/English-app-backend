import { pgTable, uuid, jsonb, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { collections } from './collections.schema';

export interface WritingQuestion {
  wordId: string;
  wordTranslate: { uz: string; ru: string };
  correctWord: string;
  answer?: string | null;
  isCorrect?: boolean | null;
}

export const writings = pgTable('writings', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
  questions: jsonb('questions').$type<WritingQuestion[]>().notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_writings_client_id').on(table.clientId),
  index('idx_writings_collection_id').on(table.collectionId),
]);
