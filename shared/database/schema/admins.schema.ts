import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const adminRoleEnum = pgEnum('admin_role', ['admin', 'super_admin']);

export const admins = pgTable(
  'admins',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: adminRoleEnum('role').notNull().default('admin'),
    fullName: varchar('full_name', { length: 255 }),
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
    index('idx_admins_username').on(table.username),
    index('idx_admins_email').on(table.email),
    index('idx_admins_role').on(table.role),
  ],
);
