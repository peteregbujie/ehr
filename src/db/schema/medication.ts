import { relations } from "drizzle-orm";
import { date, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";

const MedicationTable = pgTable(
 "medication",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
 },
 (medications) => ({
  medicationsIndex: uniqueIndex("medicationsIndex").on(medications.id),
 })
);

export const MedicationRelations = relations(
 MedicationTable,
 ({  one }) => ({
  encounter: one(EncounterTable, {
  fields: [MedicationTable.encounter_id],
  references: [EncounterTable.id],
 })
}));

export default MedicationTable;
