import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const customProtocolsTable = pgTable("custom_protocols", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CustomProtocolRow = typeof customProtocolsTable.$inferSelect;
