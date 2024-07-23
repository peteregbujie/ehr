import { InferSelectModel, relations } from "drizzle-orm";

import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AppointmentTable from "./appointment";

import ProviderTable from "./provider";
import ProviderPatientTable from "./provider_patient";
import UserTable from "./user";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import InsuranceTable from "./insurance";
import AddressTable from "./address";



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
      phone_number: numeric("phone_number", {
        precision: 10,
      })
        .unique(),
    address: text("address_id")
        .notNull()
        .references(() => AddressTable.id, { onDelete: "cascade" }),
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
    socialHistory: varchar("social_history", { length: 2000 }),
    past_medical_history: varchar("past_surgeries", { length: 2000 }),
    family_medical_history: varchar("family_history", { length: 2000 }),
    blood_type: bloodTypes("blood_type").notNull(),
    primary_care_physician: text("provider_id")
      .notNull()
      .references(() => ProviderTable.id, { onDelete: "cascade" }),
    preferred_language: preferred_language("preferred_language").notNull().default('English'),
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
  address: one(AddressTable, {
    fields: [PatientTable.address],
    references: [AddressTable.id],
  }),
  providers_patients: many(ProviderPatientTable),
  insurance: one(InsuranceTable, {
    fields: [PatientTable.user_id],
    references: [InsuranceTable.id],
  }),
  user: one(UserTable, {
    fields: [PatientTable.user_id],
    references: [UserTable.id],
  }),
}));

// Schema for inserting a patient - can be used to validate API requests
export const insertPatientSchema = createInsertSchema(PatientTable);

// Schema for selecting a patient - can be used to validate API responses
export const selectPatientSchema = createSelectSchema(PatientTable);


export type PatientTypes = InferSelectModel<typeof PatientTable>

export default PatientTable;
