import { InferSelectModel, relations } from "drizzle-orm";
import {
    numeric,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const VitalSignsTable = pgTable(
  "vital_signs",
  {
    id:uuid("id").primaryKey().defaultRandom(),
    
    encounter_id: uuid("encounter_id")
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
    measured_at: timestamp("measured_at", { mode: "date" }).notNull(),
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

export type VitalSignsType = InferSelectModel<typeof VitalSignsTable>

export const insertVitalSignSchema = createInsertSchema(VitalSignsTable);

export const selectVitalSignSchema = createSelectSchema(VitalSignsTable);



export default VitalSignsTable;