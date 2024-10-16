import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
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
    id: uuid("id").primaryKey().defaultRandom(),
    
    encounter_id: uuid("encounter_id")
      .notNull()
      .references(() => EncounterTable.id, { onDelete: "cascade" }),

      height: numeric("height", { precision: 4, scale: 2 }).notNull(),
      weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
    
    systolic_pressure: integer("systolic_pressure").notNull(),
    diastolic_pressure: integer("diastolic_pressure").notNull(),
    
    heart_rate: integer("heart_rate").notNull(),
    
    body_temperature: numeric("body_temperature", { precision: 4, scale: 1 }).notNull(),
    
    respiratory_rate: integer("respiratory_rate").notNull(),
    
    oxygen_saturation: numeric("oxygen_saturation", { precision: 5, scale: 2 }).notNull(),
    
    bmi: numeric("bmi", { precision: 4, scale: 1 }).notNull(),
    
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