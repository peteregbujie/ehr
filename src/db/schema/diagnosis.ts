import { relations } from "drizzle-orm";
import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import PatientTable from "./patient";

const DiagnosisTable = pgTable(
 "diagnosis",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  diagnosis_code: varchar("diagnosis_code").notNull(),
  description: varchar("description"),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
 },
 (diagnosis) => ({
  diagnosisIndex: uniqueIndex("diagnosisIndex").on(diagnosis.id),
 })
);

export const DiagnosisRelations = relations(DiagnosisTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [DiagnosisTable.encounter_id],
  references: [EncounterTable.id],
 }),
 patient: one(PatientTable, {
  fields: [DiagnosisTable.patient_id],
  references: [PatientTable.id],
 }),
}));

export default DiagnosisTable;
