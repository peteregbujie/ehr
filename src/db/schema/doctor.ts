import { relations } from "drizzle-orm";
import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import AppointmentTable from "./appointment";
import DoctorPatientTable from "./doctor_patient";
import EncounterTable from "./encounter";
import UserTable from "./user";

const DoctorTable = pgTable(
 "doctor",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }),
  license_number: varchar("license_number", { length: 20 }),
 },
 (doctor) => ({
  doctorIndex: uniqueIndex("doctorIndex").on(doctor.id),
 })
);

export const DoctorRelations = relations(DoctorTable, ({ one, many }) => ({
 appointments: many(AppointmentTable),
 encounter: many(EncounterTable),
 doctors_patients: many(DoctorPatientTable),
 user: one(UserTable, {
  fields: [DoctorTable.user_id],
  references: [UserTable.id],
 }),
}));

export default DoctorTable;
