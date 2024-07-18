import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


const ImmunizationTable = pgTable(
 "immunization",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), 
  vaccine_name: varchar("vaccine_name", { length: 100 }).notNull(),
  site: text("site").notNull(),
  date_administered: date("date_administered").notNull(),
  time_administered: time("time_administered").notNull(),
  encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  administrator: varchar("administrator", { length: 100 }).notNull(),
 },
 (immunization) => ({
  immunizationIndex: uniqueIndex("immunizationIndex").on(immunization.id),
 })
);

export const ImmunizationRelations = relations(
 ImmunizationTable,
 ({ one }) => ({
  encounter: one(EncounterTable, {
   fields: [ImmunizationTable.encounter_id],
   references: [EncounterTable.id],
  }),

 })
);

export const insertImmunizationSchema = createInsertSchema(ImmunizationTable);

export const selectImmunizationSchema = createSelectSchema(ImmunizationTable);

export type ImmunizationTypes = InferSelectModel<typeof ImmunizationTable>

export default ImmunizationTable;
