import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import MedicationTable from "./medication";
import PatientTable from "./patient";

const PatientsMedicationTable = pgTable(
 "patient_medications",
 {
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  medication_id: uuid("medication_id")
   .notNull()
   .references(() => MedicationTable.id, { onDelete: "cascade" }),
 },
 (pm) => ({
  pk: primaryKey({ columns: [pm.patient_id, pm.medication_id] }),
 })
);

export const PatientMedicationRelations = relations(
 PatientsMedicationTable,
 ({ one }) => ({
  patient: one(PatientTable, {
   fields: [PatientsMedicationTable.patient_id],
   references: [PatientTable.id],
  }),
  medication: one(MedicationTable, {
   fields: [PatientsMedicationTable.medication_id],
   references: [MedicationTable.id],
  }),
 })
);

export default PatientsMedicationTable;
