import { pgTable, uuid, date, unique, index } from 'drizzle-orm/pg-core';
import { clients } from './clients.schema';

export const clientActivity = pgTable('client_activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  date: date('date').notNull(),
}, (table) => [
  unique('uq_client_activity').on(table.clientId, table.date),
  index('idx_client_activity_client').on(table.clientId),
]);
