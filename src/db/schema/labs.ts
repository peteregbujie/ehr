import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const lab_status = pgEnum('lab_status', ["pending", "completed", "cancelled"]);

const LabTable = pgTable(
 "labs",
 {  
  id: uuid("id").primaryKey().defaultRandom(),
    encounter_id: uuid("encounter_id")
    .notNull()
      .references(() => EncounterTable.id, { onDelete: "cascade" }),
   test_Name: varchar("lab_name", { length: 100 }).notNull(),
   test_Code: varchar("testCode", { length: 100 }).notNull(),
   status: lab_status("lab_status").default("pending").notNull(),
   note: varchar("comments", { length: 2000 }).notNull(),
  result: varchar("lab_result", { length: 2000 }).notNull(),   
     result_Date: timestamp("result_Date", { mode: "date" })
     .notNull(),
     date_Ordered: timestamp("date_Ordered", { mode: "date" })
     .notNull()
     .defaultNow(),    
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

export const insertLabSchema = createInsertSchema(LabTable).omit({
  id: true,
});
export type NewLabType = z.infer<typeof insertLabSchema>
export const selectLabSchema = createSelectSchema(LabTable);

export type LabType = InferSelectModel<typeof LabTable>

export default LabTable;
