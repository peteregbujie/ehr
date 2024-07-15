import { relations } from "drizzle-orm";
import {
  date,
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


export const Encounter_type = pgEnum('encounter_type', ["inpatient", "outpatient", "emergency"]);

const EncounterTable = pgTable(
 "encounter",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  appointment_id: text("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
  date:  date('date'),
   time: time('time'),
  encounter_type: Encounter_type('encounter_type').notNull().default('outpatient'),
  chief_complaint: varchar("chief_complaint", { length: 2000 }),
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

export default EncounterTable;
