import { relations } from "drizzle-orm";
import {
 date,
 pgTable,
 time,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import PatientTable from "./patient";

const ImmunizationTable = pgTable(
 "immunization",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  vaccine_name: varchar("vaccine_name", { length: 100 }).notNull(),
  date_administered: date("date_administered").notNull(),
  time_administered: time("time_administered").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  administrator: varchar("administrator", { length: 100 }).notNull(),
 },
 (immunization) => ({
  immunizationIndex: uniqueIndex("immunizationIndex").on(immunization.id),
 })
);

export const ImmunizationRelations = relations(
 ImmunizationTable,
 ({ one }) => ({
  encounter: one(EncounterTable, {
   fields: [ImmunizationTable.encounter_id],
   references: [EncounterTable.id],
  }),
  patient: one(PatientTable, {
   fields: [ImmunizationTable.patient_id],
   references: [PatientTable.id],
  }),
 })
);

export default ImmunizationTable;
