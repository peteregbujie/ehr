import { relations } from "drizzle-orm";

import {
 date,
 numeric,
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
import DoctorPatientTable from "./doctor_patient";
import EncounterTable from "./encounter";
import ImmunizationTable from "./immunization";
import InsuranceTable from "./insurance";
import LabTable from "./labs";
import MedicationTable from "./medication";
import PatientsMedicationTable from "./patient_medication";
import ProcedureTable from "./procedure";
import UserTable from "./user";

export const BloodTypeEnum = pgEnum("bloodType", [
 "A positive",
 "A negative",
 "B positive",
 "B negative",
 "AB positive",
 "AB negative",
 "O positive",
 "O negative",
]);

export const LanguageEnum = pgEnum("preferredLanguage", [
 "English",
 "Spanish",
 "Vietnamese",
 "Mandarin",
 "Portuguese",
 "",
]);

const PatientTable = pgTable(
 "patient",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
  emergency_contact_name: varchar("emergency_contact_name", {
   length: 50,
  }).notNull(),
  emergency_contact_relationship: varchar("emergency_contact_relationship", {
   length: 50,
  }).notNull(),
  emergency_contact_number: numeric("emergency_contact_number", {
   precision: 10,
  }).notNull(),
  blood_type: BloodTypeEnum("bloodType").default("A positive").notNull(),
  height: numeric("height", { precision: 3, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 3 }).notNull(),
  occupation: varchar("occupation", { length: 50 }).notNull(),
  primary_care_physician: varchar("primary_care_physician", {
   length: 50,
  }),
  insurance_provider: varchar("insurance_provider", { length: 50 }),
  insurance_policy_number: varchar("insurance_policy_number", {
   length: 50,
  }),
  preferred_language: LanguageEnum("preferredLanguage").default("English"),
  created_at: timestamp(" created_at", { mode: "string" })
   .notNull()
   .defaultNow(),
  updated_at: timestamp(" created_at", { mode: "string" })
   .notNull()
   .defaultNow(),
  last_appointment: date("last_appointment"),
  next_appointment_date: date("next_appointment_date"),
  notes: varchar("notes", { length: 2000 }),
 },
 (patient) => ({
  patientIndex: uniqueIndex("patientIndex").on(patient.id),
 })
);

export const PatientRelations = relations(PatientTable, ({ one, many }) => ({
 appointments: many(AppointmentTable),
 encounter: many(EncounterTable),
 medications: many(MedicationTable),
 allergies: many(AllergiesTable),
 procedures: many(ProcedureTable),
 labs: many(LabTable),
 immunizations: many(ImmunizationTable),
 insurance: many(InsuranceTable),
 diagnosis: many(DiagnosisTable),
 doctors_patients: many(DoctorPatientTable),
 patients_medications: many(PatientsMedicationTable),
 user: one(UserTable, {
  fields: [PatientTable.user_id],
  references: [UserTable.id],
 }),
}));

export default PatientTable;
