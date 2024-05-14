import { relations } from "drizzle-orm";

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
import AdminTable from "./admin";
import DoctorTable from "./doctor";
import PatientTable from "./patient";

export const UserRoleEnum = pgEnum("user_role", ["admin", "patient", "doctor"]);

export const GenderEnum = pgEnum("gender", ["male", "female"]);

const UserTable = pgTable(
 "user",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  gender: GenderEnum("gender").default("male").notNull(),
  date_of_birth: date("date", { mode: "date" }),
  phone_number: numeric("phone_number", {
   precision: 10,
  })
   .notNull()
   .unique(),
  email: varchar("email", { length: 30 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  address: varchar("address", { length: 100 }),
  city: varchar("city", { length: 20 }),
  state: varchar("state", { length: 20 }),
  zip_code: numeric("zip_code", { precision: 5, scale: 0 }),
  image: text("image"),
  role: UserRoleEnum("user_role").default("patient").notNull(),
  created_at: timestamp("created_at", { mode: "string" })
   .notNull()
   .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
   .notNull()
   .defaultNow(),
 },
 (user) => ({
  emailIndex: uniqueIndex("users__email__idx").on(user.email),
 })
);

export const UsersRelations = relations(UserTable, ({ one }) => ({
 patients: one(PatientTable, {
  fields: [UserTable.id],
  references: [PatientTable.id],
 }),
 doctors: one(DoctorTable, {
  fields: [UserTable.id],
  references: [DoctorTable.id],
 }),
 admins: one(AdminTable, {
  fields: [UserTable.id],
  references: [AdminTable.id],
 }),
}));

export const accountsTable = pgTable(
 "account",
 {
  userId: uuid("userId")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
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

export const sessionsTable = pgTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: uuid("userId")
  .references(() => UserTable.id, { onDelete: "cascade" })
  .notNull(),
 expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokensTable = pgTable(
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

export const refreshTokensTable = pgTable(
 "refreshToken",
 {
  token: uuid("token").notNull().primaryKey().defaultRandom(),
  userId: uuid("userId")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (table) => ({
  primaryKey: [table.token, table.userId],
 })
);

export default UserTable;
