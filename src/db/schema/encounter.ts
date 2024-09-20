import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgEnum,
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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import MedicationTable from "./medication";
import InsuranceTable from "./insurance";


export const Encounter_type = pgEnum('encounter_type', ["inpatient", "outpatient", "emergency"]);

const EncounterTable = pgTable(
 "encounter",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  appointment_id: uuid("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
  date:   timestamp(" date", { mode: "date" })
  .notNull(),
   time:  time('time', { withTimezone: true }).notNull(),
  encounter_type: Encounter_type('encounter_type').notNull().default('outpatient'),
  chief_complaint: varchar("chief_complaint", { length: 2000 }).notNull(),
  assessment_and_plan: text("assessment_and_plan").notNull(),
  notes: varchar("notes", { length: 2000 }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" })
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
    medications: many(MedicationTable),
    vitalSigns: many(VitalSignsTable),
   diagnoses: many(DiagnosisTable),   
  allergies: many(AllergiesTable),
   procedures: many(ProcedureTable),
   insurance: many(InsuranceTable),
  labs: many(LabTable),
  immunizations: many(ImmunizationTable),  
  appointment: one(AppointmentTable, {
   fields: [EncounterTable.appointment_id],
   references: [AppointmentTable.id],
  }),
 })
);



// Schema for inserting a encounter - can be used to validate API requests
export const insertEncounterSchema = createInsertSchema(EncounterTable);

// Schema for selecting a encounter - can be used to validate API responses
export const selectEncounterSchema = createSelectSchema(EncounterTable);

export type EncounterTypes = InferSelectModel<typeof EncounterTable>


export default EncounterTable;
