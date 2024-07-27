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
import PatientTable from "./patient";
import ProviderTable from "./provider";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import EncounterTable from "./encounter";



export const Appointment_type = pgEnum('appointment_type', ["new_patient", "follow_up", "annual_physical"]);
export const Apt_Status = pgEnum('appointment_status', ["scheduled", "cancelled", "completed"]);

const AppointmentTable = pgTable(
 "appointment",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    reason: varchar("reason", { length: 50 }),
  patient_id: text("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  provider_id: text("provider_id")
   .notNull()
     .references(() => ProviderTable.id, { onDelete: "cascade" }),
  scheduled_date:  date('scheduled_date'),
   scheduled_time: time('scheduled_time'),
  location: varchar("location", { length: 50 }),
  type: Appointment_type('appointment_type'),
  status: Apt_Status('appointment_status').default("scheduled").notNull(),
  notes: varchar("notes", { length: 500 }),
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

export const insertAppointmentSchema = createInsertSchema(AppointmentTable);

export const selectAppointmentSchema = createSelectSchema(AppointmentTable);

export type AppointmentTypes = InferSelectModel<typeof AppointmentTable>

export default AppointmentTable;
