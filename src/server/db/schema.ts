// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `url-shortener_${name}`);

export const urls = createTable(
  "url",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    originalUrl: varchar("original_url", { length: 1024 }).notNull(),
    shortCode: varchar("short_code", { length: 256 }).notNull().unique(),
    userId: varchar("userId", { length: 256 }).notNull(),
    visits: integer("visits").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const urlAccessLogs = createTable(
  "url_access_logs",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    urlId: uuid("url_id").notNull().references(() => urls.id),  // Foreign key to `urls` table
    accessedAt: timestamp("accessed_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    userAgent: varchar("user_agent", { length: 512 }).notNull(),
    referrer: varchar("referrer", { length: 512 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    country: varchar("country", { length: 100 }),
    city: varchar("city", { length: 100 }),
    region: varchar("region", { length: 100 }),
  }
);
