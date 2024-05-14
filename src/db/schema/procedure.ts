import { relations } from "drizzle-orm";
import {
 date,
 numeric,
 pgTable,
 time,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import PatientTable from "./patient";

const ProcedureTable = pgTable(
 "procedure",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  procedure_name: varchar("procedure_name").notNull(),
  procedure_description: varchar("procedure_description"),
  procedure_cost: numeric("procedure_cost").notNull(),
  procedure_duration: time("procedure_duration").notNull(),
  procedure_date: date("procedure_date").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
 },
 (procedures) => ({
  proceduresIndex: uniqueIndex("proceduresIndex").on(procedures.id),
 })
);

export const ProcedureRelations = relations(ProcedureTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [ProcedureTable.encounter_id],
  references: [EncounterTable.id],
 }),
 patient: one(PatientTable, {
  fields: [ProcedureTable.patient_id],
  references: [PatientTable.id],
 }),
}));

export default ProcedureTable;
