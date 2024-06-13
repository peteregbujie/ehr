import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";

const DiagnosisTable = pgTable(
 "diagnosis",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    diagnosis_code: varchar("diagnosis_code").notNull(),
  description: varchar("description"),
  encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
 },
 (diagnosis) => ({
  diagnosisIndex: uniqueIndex("diagnosisIndex").on(diagnosis.id),
 })
);

export const DiagnosisRelations = relations(DiagnosisTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [DiagnosisTable.encounter_id],
  references: [EncounterTable.id],
 }),
 
}));

export default DiagnosisTable;
