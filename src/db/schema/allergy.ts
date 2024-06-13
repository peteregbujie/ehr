import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";

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
  allergy_date: date("allergy_date").notNull(),
  allergy_time: time("allergy_time").notNull(),
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

export default AllergiesTable;
