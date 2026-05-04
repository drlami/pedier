import { pgTable, text } from "drizzle-orm/pg-core";

export const hiddenProtocolsTable = pgTable("hidden_protocols", {
  id: text("id").primaryKey(),
});

export type HiddenProtocolRow = typeof hiddenProtocolsTable.$inferSelect;
