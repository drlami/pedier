import { pgTable, text, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export const customDrugsTable = pgTable("custom_drugs", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  isCustom: boolean("is_custom").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CustomDrugRow = typeof customDrugsTable.$inferSelect;
