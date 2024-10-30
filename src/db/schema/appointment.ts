import {  relations } from "drizzle-orm";
import {
  date, 
  pgEnum,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import PatientTable from "./patient";
import ProviderTable from "./provider";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import EncounterTable from "./encounter";
import { infer, z } from "zod";




export const Appointment_type = pgEnum('appointment_type', ["new_patient", "follow_up", "annual_physical"]);
export const Apt_Status = pgEnum('appointment_status', ["scheduled", "cancelled", "completed"]);

const AppointmentTable = pgTable(
 "appointment",
 {
  id: uuid("id").primaryKey().defaultRandom(),
    reason: varchar("reason", { length: 50 }).notNull(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  provider_id: uuid("provider_id")
   .notNull()
     .references(() => ProviderTable.id, { onDelete: "cascade" }),
  scheduled_date:  timestamp(" scheduled_date", { mode: "date" })
  .notNull(),
  timeSlotIndex: smallint("timeSlotIndex").notNull(),
  location: varchar("location", { length: 50 }).notNull(),
  type: Appointment_type('appointment_type').notNull(),
  status: Apt_Status('appointment_status').notNull(),
  notes: varchar("notes", { length: 500 }).notNull(),
 },
 (appointment) => ({
  appointmentIndex: uniqueIndex("appointmentIndex").on(appointment.id),
 })
);

export const AppointmentRelations = relations(AppointmentTable, ({ one, many }) => ({
 patient: one(PatientTable, {
  fields: [AppointmentTable.patient_id],
  references: [PatientTable.id],
 }),
 provider: one(ProviderTable, {
  fields: [AppointmentTable.provider_id],
  references: [ProviderTable.id],
 }),
 encounter: many(EncounterTable),
}));

export const insertAppointmentSchema = createInsertSchema(AppointmentTable)
    .extend({
        id: z.string().uuid().optional(),
    });

export type BookAppointmentType  = z.infer<typeof insertAppointmentSchema>;

export const selectAppointmentSchema = createSelectSchema(AppointmentTable);

export type AppointmentType  = z.infer<typeof selectAppointmentSchema>;

export default AppointmentTable;
