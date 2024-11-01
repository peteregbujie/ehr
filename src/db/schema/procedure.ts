import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  numeric,
  uuid,
  pgEnum,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const procedure_status = pgEnum('procedure_status', ["completed", "incomplete", "cancelled", ]);

const ProcedureTable = pgTable(
 "procedure",
 {
  id: uuid("id").primaryKey().defaultRandom(), 
  name: varchar("procedure_name").notNull(),
  description: varchar("procedure_description").notNull(),
  duration: time("procedure_duration").notNull(),
  date: date("procedure_date", { mode: "date" }).notNull(),
  time: time("procedure_time").notNull().default("10:00:00"),
  status: procedure_status("procedure_status").default("completed").notNull(),
  note: varchar("procedure_note").notNull(),
  encounter_id: uuid("encounter_id")
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

export const insertProcedureSchema = createInsertSchema(ProcedureTable).omit({
  id: true,
});
export type NewProcedureType = z.infer<typeof insertProcedureSchema>
export const selectProcedureSchema = createSelectSchema(ProcedureTable)

export type ProcedureType = InferSelectModel<typeof ProcedureTable>



export default ProcedureTable;
