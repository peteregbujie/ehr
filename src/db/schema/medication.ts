import { InferSelectModel, relations } from "drizzle-orm";
import { date, pgEnum, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";


export const Med_Route = pgEnum('med_route', ["oral", "IV"]);


export const Med_Status = pgEnum('med_status', ["active", "Inactive", "suspended", "completed"]);


const MedicationTable = pgTable(
 "medication",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  route: Med_Route("med_route").notNull(),  
  status: Med_Status("med_status").notNull(),
  note: varchar("note", { length: 100 }),
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



// Schema for inserting a medication - can be used to validate API requests
export const insertMedicationSchema = createInsertSchema(MedicationTable);

// Schema for selecting a medication - can be used to validate API responses
export const selectMedicationSchema = createSelectSchema(MedicationTable);

export type MedicationType = InferSelectModel<typeof MedicationTable>



export default MedicationTable;
