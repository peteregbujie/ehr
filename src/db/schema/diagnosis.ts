import { InferSelectModel, relations } from "drizzle-orm";
import { uuid, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const severity = pgEnum('severity', ["mild","moderate", "severe"]);

const DiagnosisTable = pgTable(
 "diagnosis",
 {
  id: uuid("id").primaryKey().defaultRandom(),
    diagnosis_name: varchar("diagnosis_name", { length: 50 }).notNull(),
    diagnosis_code: varchar("diagnosis_code", { length: 50 }).notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
   severity: severity("severity").notNull(),   
   note: varchar("description", { length: 2000 }),
   updated_At: timestamp("updated_at", { mode: "date" })
   .notNull()
   .defaultNow(),
   created_At: timestamp("created_at", { mode: "date" })
   .notNull()
   .defaultNow(),

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

export const insertDiagnosisSchema = createInsertSchema(DiagnosisTable).omit({
  id: true,
});

export const selectDiagnosisSchema = createSelectSchema(DiagnosisTable);

export type NewDiagnosisType = z.infer<typeof insertDiagnosisSchema> 
export type DiagnosisType = InferSelectModel<typeof DiagnosisTable>

export default DiagnosisTable;
