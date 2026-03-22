import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { collections } from './collections.schema';

export const words = pgTable('words', {
  id: uuid('id').primaryKey().defaultRandom(),
  collectionId: uuid('collection_id')
    .notNull()
    .references(() => collections.id),
  word: varchar('word', { length: 255 }).notNull(),
  wordTranslate: jsonb('word_translate')
    .$type<{ uz: string; ru: string }>()
    .notNull(),
  transcription: varchar('transcription', { length: 255 }),
  example: text('example'),
  exampleTranslate: jsonb('example_translate')
    .$type<{ uz: string; ru: string }>(),
  audioUrl: varchar('audio_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('idx_words_collection_id').on(table.collectionId),
]);
