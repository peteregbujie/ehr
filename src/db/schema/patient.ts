import { relations } from "drizzle-orm";

import {
  date,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AppointmentTable from "./appointment";
import EncounterTable from "./encounter";
import InsuranceTable from "./insurance";

import ProviderTable from "./provider";
import ProviderPatientTable from "./provider_patient";
import UserTable from "./user";
import VitalSignsTable from "./vitalsign";

const PatientTable = pgTable(
 "patient",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
   .notNull()
     .references(() => UserTable.id, { onDelete: "cascade" }),
  height: numeric("height", { precision: 3, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 3 }).notNull(),
   occupation: varchar("occupation", { length: 50 }).notNull(),
  marital_status: text("language", {
   enum: ["Married", "Single", "Divorced", "Widowed"],
  }).notNull(),
  emergency_contact_name: varchar("emergency_contact_name", {
   length: 50,
  }).notNull(),
  emergency_contact_relationship: varchar("emergency_contact_relationship", {
   length: 50,
  }).notNull(),
  emergency_contact_number: numeric("emergency_contact_number", {
   precision: 10,
  }).notNull(),
   allergies: varchar("allergies", { length: 2000 }),
   chronic_conditions: varchar("chronic_conditions", { length: 2000 }),
   medications: varchar("medications", { length: 2000 }),
   past_surgeries: varchar("past_surgeries", { length: 2000 }),
  family_history: varchar("family_history", { length: 2000 }),
  blood_type: text("blood_type", {
   enum: [
    "A positive",
    "A negative",
    "B positive",
    "B negative",
    "AB positive",
    "AB negative",
    "O positive",
    "O negative",
   ],
  }).notNull(),
    primary_care_physician: text("provider_id")
   .notNull()
   .references(() => ProviderTable.id, { onDelete: "cascade" }),
  insurance_provider: varchar("insurance_provider", { length: 50 }),
  insurance_policy_number: varchar("insurance_policy_number", {
   length: 50,
  }),
  preferred_language: text("language", {
   enum: ["English", "Spanish", "Vietnamese", "Mandarin", "Portuguese"],
  }).notNull(),
  race: varchar("race", { length: 50 }),
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
  insurance: many(InsuranceTable),
 VitalSigns: many(VitalSignsTable),
 providers_patients: many(ProviderPatientTable),
 user: one(UserTable, {
  fields: [PatientTable.user_id],
  references: [UserTable.id],
 }),
}));

export default PatientTable;
