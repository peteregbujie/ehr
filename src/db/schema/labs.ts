import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";

const LabTable = pgTable(
 "labs",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
   lab_name: varchar("lab_name", { length: 100 }),
  lab_result: varchar("lab_result", { length: 2000 }),  
  encounter_id: text("encounter_id")
   .notNull()
     .references(() => EncounterTable.id, { onDelete: "cascade" }),
   date_ordered: date("date_ordered"),
  date_received: date("date_received"),
 },
 (labs) => ({
  labsIndex: uniqueIndex("labsIndex").on(labs.id),
 })
);
export const LabRelations = relations(LabTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [LabTable.encounter_id],
  references: [EncounterTable.id],
 }),
 
}));

export default LabTable;
