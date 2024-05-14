import { relations } from "drizzle-orm";
import {
 pgEnum,
 pgTable,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";
import AllergiesTable from "./allergy";
import AppointmentTable from "./appointment";
import DiagnosisTable from "./diagnosis";
import DoctorTable from "./doctor";
import ImmunizationTable from "./immunization";
import LabTable from "./labs";
import PatientTable from "./patient";
import ProcedureTable from "./procedure";

export const encounterEnum = pgEnum("encounter", [
 "inpatient",
 "outpatient",
 "emergency",
]);

const EncounterTable = pgTable(
 "encounter",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorTable.id, { onDelete: "cascade" }),
  appointment_id: uuid("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
  date_time: timestamp("date_time", { precision: 6, withTimezone: true })
   .notNull()
   .defaultNow(),
  encounter_type: encounterEnum("encounter").default("inpatient").notNull(),
  chief_complaint: varchar("chief_complaint", { length: 256 }),
  history_of_present_illness: varchar("varchar2", { length: 256 }),
  physical_exam: varchar("physical_exam", { length: 256 }),
  assessment_and_plan: varchar("assessment_and_plan", { length: 2000 }),
  notes: varchar("notes", { length: 1000 }),
  created_at: timestamp("created_at", { mode: "string" })
   .notNull()
   .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
   .notNull()
   .defaultNow(),
 },
 (encounter) => ({
  encounterIndex: uniqueIndex("encounterIndex").on(encounter.id),
 })
);

export const EncounterRelations = relations(
 EncounterTable,
 ({ one, many }) => ({
  diagnosis: many(DiagnosisTable),
  allergies: many(AllergiesTable),
  procedures: many(ProcedureTable),
  labs: many(LabTable),
  immunizations: many(ImmunizationTable),
  patients: one(PatientTable, {
   fields: [EncounterTable.patient_id],
   references: [PatientTable.id],
  }),
  doctors: one(DoctorTable, {
   fields: [EncounterTable.doctor_id],
   references: [DoctorTable.id],
  }),
  appointment: one(AppointmentTable, {
   fields: [EncounterTable.appointment_id],
   references: [AppointmentTable.id],
  }),
 })
);

export default EncounterTable;
