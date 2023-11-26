// schema.ts
import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  hasAttachment: integer("has_attachment", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at").notNull(),
});
