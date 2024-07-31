import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  numeric,
  pgEnum,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const procedure_status = pgEnum('procedure_status', ["completed", "incomplete", "cancelled", ]);

const ProcedureTable = pgTable(
 "procedure",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), 
  name: varchar("procedure_name").notNull(),
  description: varchar("procedure_description"),
  duration: time("procedure_duration").notNull(),
  date: date("procedure_date").notNull(),
  status: procedure_status("procedure_status").default("completed"),
  note: varchar("procedure_note"),
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

export const selectProcedureSchema = createSelectSchema(ProcedureTable);

export type ProcedureTypes = InferSelectModel<typeof ProcedureTable>



export default ProcedureTable;
