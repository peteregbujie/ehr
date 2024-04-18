import type { AdapterAccount } from "@auth/core/adapters";
import {
 integer,
 pgTable,
 text,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
 "user",
 {
  id: uuid("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 256 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role", { enum: ["admin", "patient", "doctor"] })
   .notNull()
   .default("patient"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
 },
 (user) => ({
  emailIndex: uniqueIndex("users__email__idx").on(user.email),
 })
);

export const accounts = pgTable(
 "account",
 {
  userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
 },
 (account) => ({
  primaryKey: [account.provider, account.providerAccountId],
 })
);

export const sessions = pgTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: text("userId")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
 expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
 "verificationToken",
 {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
  primaryKey: [vt.identifier, vt.token],
 })
);
