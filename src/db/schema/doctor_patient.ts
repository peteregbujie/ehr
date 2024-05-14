import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import DoctorTable from "./doctor";
import PatientTable from "./patient";

const DoctorPatientTable = pgTable(
 "doctors_patients",
 {
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorTable.id, { onDelete: "cascade" }),
 },
 (t) => ({
  pk: primaryKey({ columns: [t.patient_id, t.doctor_id] }),
 })
);

export const DoctorPatientRelations = relations(
 DoctorPatientTable,
 ({ one }) => ({
  patients: one(PatientTable, {
   fields: [DoctorPatientTable.patient_id],
   references: [PatientTable.id],
  }),

  doctors: one(DoctorTable, {
   fields: [DoctorPatientTable.doctor_id],
   references: [DoctorTable.id],
  }),
 })
);

export default DoctorPatientTable;
