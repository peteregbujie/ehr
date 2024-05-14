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

const AllergiesTable = pgTable(
 "allergy",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  encounter_id: uuid("patient_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  allergen: varchar("allergen", { length: 100 }),
  allergy_reaction: varchar("allergy_reaction", { length: 100 }),
  allergy_date: date("allergy_date").notNull(),
  allergy_time: time("allergy_time").notNull(),
 },
 (allergies) => ({
  allergiesIndex: uniqueIndex("allergiesIndex").on(allergies.id),
 })
);

export const AllergiesRelations = relations(AllergiesTable, ({ one }) => ({
 patient: one(PatientTable, {
  fields: [AllergiesTable.patient_id],
  references: [PatientTable.id],
 }),
 encounter: one(EncounterTable, {
  fields: [AllergiesTable.encounter_id],
  references: [EncounterTable.id],
 }),
}));

export default AllergiesTable;
