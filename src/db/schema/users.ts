import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
 id: text("id").notNull().primaryKey(),
 name: varchar("name", { length: 255 }).notNull(),
 email: text("email").notNull(),
});
