import { relations } from "drizzle-orm";
import {
  date,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import PatientTable from "./patient";
import ProviderTable from "./provider";

const AppointmentTable = pgTable(
 "appointment",
 {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  patient_id: text("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  provider_id: text("provider_id")
   .notNull()
     .references(() => ProviderTable.id, { onDelete: "cascade" }),
  scheduled_date:  date('scheduled_date'),
   scheduled_time: time('scheduled_time'),
  location: text("location"),
  type: text("appointment_type", {
   enum: ["new_patient", "follow_up", "annual_physical"],
  }).notNull(),
  status: text("status", {
   enum: ['scheduled', 'cancelled', 'completed'],
  }).notNull(),
  notes: varchar("notes", { length: 500 }),
 },
 (appointment) => ({
  appointmentIndex: uniqueIndex("appointmentIndex").on(appointment.id),
 })
);

export const AppointmentRelations = relations(AppointmentTable, ({ one }) => ({
 patient: one(PatientTable, {
  fields: [AppointmentTable.patient_id],
  references: [PatientTable.id],
 }),
 provider: one(ProviderTable, {
  fields: [AppointmentTable.provider_id],
  references: [ProviderTable.id],
 }),
}));

export default AppointmentTable;
