import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').references(() => clients.id), // null = hammaga
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 20 }).notNull().default('info'), // 'info' | 'success' | 'warning'
  source: varchar('source', { length: 20 }).notNull().default('admin'), // 'admin' | 'system'
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_notifications_client').on(table.clientId),
  index('idx_notifications_read').on(table.readAt),
]);
