import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AllergiesTable from "./allergy";
import AppointmentTable from "./appointment";
import DiagnosisTable from "./diagnosis";
import ImmunizationTable from "./immunization";
import LabTable from "./labs";
import PatientTable from "./patient";
import ProcedureTable from "./procedure";
import ProviderTable from "./provider";
import VitalSignsTable from "./vitalsign";

const EncounterTable = pgTable(
 "encounter",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patient_id: text("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  provider_id: text("provider_id")
   .notNull()
   .references(() => ProviderTable.id, { onDelete: "cascade" }),
  appointment_id: text("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
  date:  date('date'),
   time: time('time'),
  encounter_type: text("encounter_type", {
   enum: ["inpatient", "outpatient", "emergency"],
  }).notNull(),
  chief_complaint: varchar("chief_complaint", { length: 2000 }),
  medical_history: text("medical_history"),
  physical_exam: text("physical_exam"),
  assessment_and_plan: text("assessment_and_plan"),
  notes: varchar("notes", { length: 2000 }),
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
    vitalSigns: many(VitalSignsTable),
   diagnosis: many(DiagnosisTable),   
  allergies: many(AllergiesTable),
   procedures: many(ProcedureTable),  
  labs: many(LabTable),
  immunizations: many(ImmunizationTable),
  patients: one(PatientTable, {
   fields: [EncounterTable.patient_id],
   references: [PatientTable.id],
  }),
  providers: one(ProviderTable, {
   fields: [EncounterTable.provider_id],
   references: [ProviderTable.id],
  }),
  appointment: one(AppointmentTable, {
   fields: [EncounterTable.appointment_id],
   references: [AppointmentTable.id],
  }),
 })
);

export default EncounterTable;
