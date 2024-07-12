import { relations } from "drizzle-orm";

import {
  date,
  numeric,
  pgEnum,
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
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';



export const bloodTypes = pgEnum('blood_types', ["A positive",
  "A negative",
  "B positive",
  "B negative",
  "AB positive",
  "AB negative",
  "O positive",
  "O negative",]);

export const marital_status = pgEnum('marital_status', ["Married", "Single", "Divorced", "Widowed"]);
export const preferred_language = pgEnum('preferred_language', ["English", "Spanish", "Vietnamese", "Mandarin", "Portuguese"]);

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
    marital_status: marital_status("marital_status").notNull(),
    emergency_contact_name: varchar("emergency_contact_name", {
      length: 50,
    }).notNull(),
    emergency_contact_relationship: varchar("emergency_contact_relationship", {
      length: 50,
    }).notNull(),
    emergency_contact_number: numeric("emergency_contact_number", {
      precision: 10,
    }).notNull(),
    chronic_conditions: varchar("chronic_conditions", { length: 2000 }),
    past_surgeries: varchar("past_surgeries", { length: 2000 }),
    family_history: varchar("family_history", { length: 2000 }),
    blood_type: bloodTypes("blood_type").notNull(),
    primary_care_physician: text("provider_id")
      .notNull()
      .references(() => ProviderTable.id, { onDelete: "cascade" }),
    preferred_language: preferred_language("preferred_language").notNull().default('English'),
    race: varchar("race", { length: 50 }),
    created_at: timestamp(" created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp(" created_at", { mode: "string" })
      .notNull()
      .defaultNow(),

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

// Schema for inserting a patient - can be used to validate API requests
export const insertPatientSchema = createInsertSchema(PatientTable);

// Schema for selecting a patient - can be used to validate API responses
export const selectPatientSchema = createSelectSchema(PatientTable);

export default PatientTable;
