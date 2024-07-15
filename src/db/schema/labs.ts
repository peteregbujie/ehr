import { relations } from "drizzle-orm";
import {
  date,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";

export const lab_status = pgEnum('lab_status', ["pending", "completed", "cancelled"]);

const LabTable = pgTable(
 "labs",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    encounter_id: text("encounter_id")
    .notNull()
      .references(() => EncounterTable.id, { onDelete: "cascade" }),
   test_Name: varchar("lab_name", { length: 100 }),
   test_Code: varchar("testCode", { length: 100 }),
   status: lab_status("lab_status").default("pending").notNull(),
   comments: varchar("comments", { length: 2000 }),
  result: varchar("lab_result", { length: 2000 }),   
     resultDate: date("resultDate"),
     createdAt: date("date_ordered")     
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
