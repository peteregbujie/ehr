import { relations } from "drizzle-orm";
import {
 pgTable,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import PatientTable from "./patient";

const LabTable = pgTable(
 "labs",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }),
  license_number: varchar("license_number", { length: 20 }),
  lab_name: varchar("lab_name", { length: 100 }),
  lab_result: varchar("lab_result", { length: 2000 }),
  created_at: timestamp("created_at", { mode: "string" })
   .notNull()
   .defaultNow(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
 },
 (labs) => ({
  labsIndex: uniqueIndex("labsIndex").on(labs.id),
 })
);
export const LabRelations = relations(LabTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [LabTable.encounter_id],
  references: [EncounterTable.id],
 }),
 patient: one(PatientTable, {
  fields: [LabTable.patient_id],
  references: [PatientTable.id],
 }),
}));

export default LabTable;
