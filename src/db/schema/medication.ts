import { InferSelectModel, relations } from "drizzle-orm";
import { date, uuid, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";



export const Med_Route = pgEnum('med_route', ["oral", "IV"]);


export const Med_Status = pgEnum('med_status', ["active", "Inactive", "suspended", "completed"]);


const MedicationTable = pgTable(
 "medication",
 {
  id: uuid("id").primaryKey().defaultRandom(),
    encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  route: Med_Route("med_route").notNull(),  
  status: Med_Status("med_status").notNull(),
  note: varchar("note", { length: 100 }).notNull(),
  start_date: timestamp("start_date", { mode: "date" })
  .notNull(),
  end_date: timestamp("end_date", { mode: "date" })
  .notNull(),
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
