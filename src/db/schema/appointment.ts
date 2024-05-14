import { relations } from "drizzle-orm";
import {
 pgTable,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";
import DoctorTable from "./doctor";
import PatientTable from "./patient";

const AppointmentTable = pgTable(
 "appointment",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorTable.id, { onDelete: "cascade" }),
  date_time: timestamp("date_time", { precision: 6, withTimezone: true })
   .notNull()
   .defaultNow(),
  reason_for_visit: varchar("reason_for_visit", { length: 100 }),
  notes: varchar("notes", { length: 100 }),
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
 doctor: one(DoctorTable, {
  fields: [AppointmentTable.doctor_id],
  references: [DoctorTable.id],
 }),
}));

export default AppointmentTable;
