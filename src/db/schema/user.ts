import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

import {
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AdminTable from "./admin";
import PatientTable from "./patient";
import ProviderTable from "./provider";

const UserTable = pgTable(
 "user",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 100 }),
  gender: text("gender", { enum: ["male", "female"] }),
  date_of_birth: date("date", { mode: "date" }),
  phone_number: numeric("phone_number", {
   precision: 10,
  })
    .unique(),
  email: varchar("email", { length: 30 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  address: varchar("address", { length: 100 }),
  city: varchar("city", { length: 20 }),
  state: varchar("state", { length: 20 }),
  zip_code: numeric("zip_code", { precision: 5, scale: 0 }),
  image: text("image"),
  role: text("role", { enum: ["admin", "patient", "provider"] }),
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
 providers: one(ProviderTable, {
  fields: [UserTable.id],
  references: [ProviderTable.id],
 }),
 admins: one(AdminTable, {
  fields: [UserTable.id],
  references: [AdminTable.id],
 }),
}));


export const AccountsTable = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
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
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const SessionsTable = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const VerificationTokensTable = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 




export default UserTable;
