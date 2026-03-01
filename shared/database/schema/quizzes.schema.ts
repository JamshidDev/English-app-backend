import {
  pgTable,
  uuid,
  jsonb,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';
import { collections } from './collections.schema';

export interface QuizOption {
  wordId: string;
  wordTranslate: { uz: string; ru: string };
}

export interface QuizQuestion {
  wordId: string;
  word: string;
  transcription: string | null;
  options: QuizOption[];
  correctIndex: number;
  selectedIndex?: number | null;
}

export const quizzes = pgTable(
  'quizzes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id),
    questions: jsonb('questions').$type<QuizQuestion[]>().notNull(),
    totalQuestions: integer('total_questions').notNull(),
    correctAnswers: integer('correct_answers'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('idx_quizzes_client_id').on(table.clientId),
    index('idx_quizzes_collection_id').on(table.collectionId),
  ],
);
