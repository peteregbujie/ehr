import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";

const InsuranceTable = pgTable(
 "insurance",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  encounter_id: text("patient_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  company_name: varchar("company_name").notNull(),
  policy_number: varchar("policy_number"),
  group_number: varchar("group_number"),
  phone_number: varchar("phone_number"),
 },
 (insurance) => ({
  insuranceIndex: uniqueIndex("insuranceIndex").on(insurance.id),
 })
);

export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
 patient: one(EncounterTable, {
  fields: [InsuranceTable.encounter_id],
  references: [EncounterTable.id],
 }),
}));

export default InsuranceTable;
