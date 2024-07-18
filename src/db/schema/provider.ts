import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import AppointmentTable from "./appointment";
import EncounterTable from "./encounter";
import ProviderPatientTable from "./provider_patient";
import UserTable from "./user";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const ProviderTable = pgTable(
 "provider",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }),
   license_number: varchar("license_number", { length: 20 }),
  provider_qualification: text("provider_qualification", {
   enum: [
    "MD",
    "NP",
    
   ],
  }).notNull(),
 },
 (provider) => ({
  providerIndex: uniqueIndex("providerIndex").on(provider.id),
 })
);

export const providerRelations = relations(ProviderTable, ({ one, many }) => ({
 appointments: many(AppointmentTable),
 encounter: many(EncounterTable),
 providers_patients: many(ProviderPatientTable),
 user: one(UserTable, {
  fields: [ProviderTable.user_id],
  references: [UserTable.id],
 }),
}));



export const insertProviderSchema = createInsertSchema(ProviderTable);
export const selectProviderSchema = createSelectSchema(ProviderTable);

export type ProviderTypes = InferSelectModel<typeof ProviderTable>

export default ProviderTable;
