import { relations } from "drizzle-orm";
import { date, pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import DoctorTable from "./doctor";
import EncounterTable from "./encounter";
import PatientTable from "./patient";
import PatientsMedicationTable from "./patient_medication";

const MedicationTable = pgTable(
 "medication",
 {
  id: uuid("id:").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorTable.id, { onDelete: "cascade" }),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
 },
 (medications) => ({
  medicationsIndex: uniqueIndex("medicationsIndex").on(medications.id),
 })
);

export const MedicationRelations = relations(
 MedicationTable,
 ({ one, many }) => ({
  patient: one(PatientTable, {
   fields: [MedicationTable.patient_id],
   references: [PatientTable.id],
  }),
  patients_medications: many(PatientsMedicationTable),
 })
);

export default MedicationTable;
