import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  pgEnum,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Severity = pgEnum('severity', ["mild","moderate", "severe"]);

const AllergiesTable = pgTable(
 "allergy",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
   encounter_id: text("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  allergen: varchar("allergen", { length: 100 }),
  allergy_reaction: varchar("allergy_reaction", { length: 100 }),
 severity: Severity("severity").notNull(),
  note: varchar("note", { length: 2000 }),
  updated_At: date("updated_At").notNull(),
  created_At: date("created_At").notNull(),
 },
 (allergies) => ({
  allergiesIndex: uniqueIndex("allergiesIndex").on(allergies.id),
 })
);

export const AllergiesRelations = relations(AllergiesTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [AllergiesTable.encounter_id],
  references: [EncounterTable.id],
 }),
}));

export const insertAllergiesSchema = createInsertSchema(AllergiesTable);

export const selectAllergiesSchema = createSelectSchema(AllergiesTable);

export type AllergiesTypes = InferSelectModel<typeof AllergiesTable>

export default AllergiesTable;
