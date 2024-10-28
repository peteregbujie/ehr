import { InferSelectModel, relations } from "drizzle-orm";

import {
  decimal,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
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
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
      phone_number: numeric("phone_number", {
        precision: 10,
      })
        .unique().notNull(),
    address: uuid("address_id")
        .notNull()
        .references(() => AddressTable.id, { onDelete: "cascade" }),
    height: numeric("height", { precision: 4, scale: 2 }).notNull(),
    weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
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
    socialHistory: varchar("social_history", { length: 2000 }).notNull(),
    past_medical_history: varchar("past_surgeries", { length: 2000 }).notNull(),
    family_medical_history: varchar("family_history", { length: 2000 }).notNull(),
    blood_type: bloodTypes("blood_type").notNull(),
    primary_care_physician: uuid("provider_id").notNull().references(() => ProviderTable.id, { onDelete: "cascade" }),
    preferred_language: preferred_language("preferred_language").notNull().default('English'),
    created_at: timestamp(" created_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp(" updated_at", { mode: "date" })
      .notNull()
      .defaultNow(),

    notes: varchar("notes", { length: 2000 }).notNull(),
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

export const insertPatientSchema = createInsertSchema(PatientTable).omit({
  id: true,
  created_at: true, 
  updated_at: true
});


export const selectPatientSchema = createSelectSchema(PatientTable);


export type PatientTypes = InferSelectModel<typeof PatientTable>

export default PatientTable;
