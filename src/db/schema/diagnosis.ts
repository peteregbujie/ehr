import { relations } from "drizzle-orm";
import { date, pgEnum, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const severity = pgEnum('severity', ["mild","moderate", "severe"]);

const DiagnosisTable = pgTable(
 "diagnosis",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    diagnosis_name: varchar("diagnosis_name", { length: 50 }).notNull(),
    diagnosis_code: varchar("diagnosis_code", { length: 50 }).notNull(),
  encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
   severity: severity("severity").notNull(),   
   note: varchar("description", { length: 2000 }),
   updated_At: date("updated_At").notNull(),
   created_At: date("created_At").notNull(),

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

// Schema for inserting a medication - can be used to validate API requests
export const insertDiagnosisSchema = createInsertSchema(DiagnosisTable);

// Schema for selecting a medication - can be used to validate API responses
export const selectDiagnosisSchema = createSelectSchema(DiagnosisTable);

export default DiagnosisTable;
