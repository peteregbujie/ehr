import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


const ImmunizationTable = pgTable(
 "immunization",
 {
  id: uuid("id").primaryKey().defaultRandom(), 
  vaccine_name: varchar("vaccine_name", { length: 100 }).notNull(),
  site: text("site").notNull(),
  vaccination_date: timestamp("vaccination_date", { mode: "date" })
  .notNull(),
  vaccination_time: time("time_administered").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
   vaccinator: varchar("administrator", { length: 100 }).notNull(),
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

export type ImmunizationType = InferSelectModel<typeof ImmunizationTable>

export default ImmunizationTable;
