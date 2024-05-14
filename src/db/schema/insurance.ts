import { relations } from "drizzle-orm";
import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import PatientTable from "./patient";

const InsuranceTable = pgTable(
 "insurance",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
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
 patient: one(PatientTable, {
  fields: [InsuranceTable.patient_id],
  references: [PatientTable.id],
 }),
}));

export default InsuranceTable;
