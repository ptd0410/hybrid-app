import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const appsSchema = sqliteTable("apps", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  version: text("version"),
  path: text("path"),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});
