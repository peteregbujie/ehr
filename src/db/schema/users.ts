import type { AdapterAccount } from "@auth/core/adapters";
import {
 date,
 integer,
 numeric,
 pgEnum,
 pgTable,
 text,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";

export const UserRoleEnum = pgEnum("userrole", ["admin", "patient", "doctor"]);

export const GenderEnum = pgEnum("gender", ["male", "female"]);

export const UsersTable = pgTable(
 "user",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  gender: GenderEnum("gender").default("male").notNull(),
  date_of_birth: date("date", { mode: "date" }),
  email: varchar("email", { length: 256 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  address: varchar("address", { length: 100 }),
  city: varchar("city", { length: 20 }),
  state: varchar("state", { length: 20 }),
  zip_code: numeric("zip_code", { precision: 5 }),
  image: text("image"),
  role: UserRoleEnum("userrole").default("patient").notNull(),
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
  userId: uuid("userId")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: uuid("providerAccountId").notNull(),
  refresh_token: uuid("refresh_token"),
  access_token: uuid("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: uuid("id_token"),
  session_state: text("session_state"),
 },
 (account) => ({
  primaryKey: [account.provider, account.providerAccountId],
 })
);

export const sessions = pgTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: uuid("userId")
  .references(() => UsersTable.id, { onDelete: "cascade" })
  .notNull(),
 expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
 "verificationToken",
 {
  identifier: text("identifier").notNull(),
  token: uuid("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
  primaryKey: [vt.identifier, vt.token],
 })
);
