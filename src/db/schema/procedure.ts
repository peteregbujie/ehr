import { relations } from "drizzle-orm";
import {
  date,
  numeric,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const ProcedureTable = pgTable(
 "procedure",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), 
  procedure_name: varchar("procedure_name").notNull(),
  procedure_description: varchar("procedure_description"),
  procedure_cost: numeric("procedure_cost").notNull(),
  procedure_duration: time("procedure_duration").notNull(),
  procedure_date: date("procedure_date").notNull(),
  encounter_id: text("encounter_id")
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
 
}));

export const insertProcedureSchema = createInsertSchema(ProcedureTable);

// Schema for selecting a patient - can be used to validate API responses
export const selectProcedureSchema = createSelectSchema(ProcedureTable);

export default ProcedureTable;
