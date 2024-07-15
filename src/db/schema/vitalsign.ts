import { relations } from "drizzle-orm";
import {
    numeric,
    pgTable,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";

const VitalSignsTable = pgTable(
  "vital_signs",
  {
    id: text("id")
     .primaryKey()
     .$defaultFn(() => crypto.randomUUID()),
    
    encounter_id: text("encounter_id")
     .notNull()
          .references(() => EncounterTable.id, { onDelete: "cascade" }),
    height: numeric("height", { precision: 3, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 3 }).notNull(),
    systolic_pressure: numeric("systolic_pressure", { precision: 5, scale: 2 })
     .notNull(),
    diastolic_pressure: numeric("diastolic_pressure", { precision: 5, scale: 2 })
     .notNull(),
    heart_rate: numeric("heart_rate", { precision: 5, scale: 2 })
     .notNull(),
    body_temperature: numeric("body_temperature", { precision: 5, scale: 2 })
          .notNull(),
    respiratory_rate: numeric("respiratory_rate", { precision: 5, scale: 2 }) 
    .notNull(), 
    oxygen_saturation: numeric("oxygen_saturation", { precision: 5, scale: 2 }) 
    .notNull(), 
    bmi: numeric("bmi", { precision: 5, scale: 2 }).notNull(),
    measured_at: timestamp("measured_at").notNull(),
  },
  (vitalSigns) => ({
    encounterIndex: uniqueIndex("encounter__id__idx").on(vitalSigns.encounter_id),
  })
);


export const VitalSignRelations = relations(VitalSignsTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [VitalSignsTable.encounter_id],
  references: [EncounterTable.id],
 }),

 
}));

export default VitalSignsTable;