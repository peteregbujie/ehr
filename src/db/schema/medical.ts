import { relations } from "drizzle-orm";
import {
 date,
 numeric,
 pgEnum,
 pgTable,
 primaryKey,
 time,
 timestamp,
 uniqueIndex,
 uuid,
 varchar,
} from "drizzle-orm/pg-core";

import { UsersTable } from "./users";

export const EncounterEnum = pgEnum("encounterenum", [
 "inpatient",
 "outpatient",
 "emergency",
]);

export const BloodTypeEnum = pgEnum("bloodType", [
 "A positive",
 "A negative",
 "B positive",
 "B negative",
 "AB positive",
 "AB negative",
 "O positive",
 "O negative",
]);

export const LanguageEnum = pgEnum("preferredLanguage", [
 "English",
 "Spanish",
 "Vietnamese",
 "Mandarin",
 "Portuguese",
 "",
]);

export const AdminsTable = pgTable("admin", {
 id: uuid("id").primaryKey().defaultRandom(),
 user_id: uuid("user_id")
  .notNull()
  .references(() => UsersTable.id, { onDelete: "cascade" }),
});

export const PatientsTable = pgTable(
 "patient",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  emergency_contact_name: varchar("emergency_contact_name", {
   length: 50,
  }).notNull(),
  emergency_contact_relationship: varchar("emergency_contact_relationship", {
   length: 50,
  }).notNull(),
  emergency_contact_number: numeric("emergency_contact_number", {
   precision: 10,
  }).notNull(),
  blood_type: BloodTypeEnum("bloodType").default("A positive").notNull(),
  height: numeric("height", { precision: 1, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 3 }).notNull(),
  occupation: varchar("occupation", { length: 50 }).notNull(),
  primary_care_physician: varchar("primary_care_physician", {
   length: 50,
  }).notNull(),
  insurance_provider: varchar("insurance_provider", { length: 50 }).notNull(),
  insurance_policy_number: varchar("insurance_policy_number", {
   length: 50,
  }).notNull(),
  preferred_language: LanguageEnum("preferredLanguage")
   .default("English")
   .notNull(),
  created_at: timestamp(" created_at").notNull().defaultNow(),
  last_appointment: date("last_appointment").notNull(),
  next_appointment_date: date("next_appointment_date").notNull(),
  notes: varchar("notes", { length: 2000 }),
 },
 (patient) => ({
  patientIndex: uniqueIndex("patientIndex").on(patient.id),
 })
);

export const DoctorsTable = pgTable(
 "doctor",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }),
  license_number: varchar("license_number", { length: 20 }),
  appointments: uuid("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
 },
 (doctor) => ({
  doctorIndex: uniqueIndex("doctorIndex").on(doctor.id),
 })
);

export const MedicationsTable = pgTable(
 "medication",
 {
  id: uuid("id:").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorsTable.id, { onDelete: "cascade" }),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncountersTable.id, { onDelete: "cascade" }),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
 },
 (medications) => ({
  medicationsIndex: uniqueIndex("medicationsIndex").on(medications.id),
 })
);

export const LabsTable = pgTable(
 "labs",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }),
  license_number: varchar("license_number", { length: 20 }),
  lab_name: varchar("lab_name", { length: 100 }),
  lab_result: varchar("lab_result", { length: 2000 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncountersTable.id, { onDelete: "cascade" }),
 },
 (labs) => ({
  labsIndex: uniqueIndex("labsIndex").on(labs.id),
 })
);

export const AllergiesTable: any = pgTable(
 "allergy",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  allergen: varchar("allergen", { length: 100 }),
  allergy_reaction: varchar("allergy_reaction", { length: 100 }),
  allergy_date: date("allergy_date").notNull(),
  allergy_time: time("allergy_time").notNull(),
 },
 (allergies) => ({
  allergiesIndex: uniqueIndex("allergiesIndex").on(allergies.id),
 })
);

export const ImmunizationTable = pgTable(
 "immunization",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => UsersTable.id, { onDelete: "cascade" }),
  vaccine_name: varchar("vaccine_name", { length: 100 }).notNull(),
  date_administered: date("date_administered").notNull(),
  time_administered: time("time_administered").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncountersTable.id, { onDelete: "cascade" }),
  administrator: varchar("administrator", { length: 100 }).notNull(),
 },
 (immunization) => ({
  immunizationIndex: uniqueIndex("immunizationIndex").on(immunization.id),
 })
);

export const AppointmentTable: any = pgTable(
 "appointment",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorsTable.id, { onDelete: "cascade" }),
  dateandtime: timestamp("dateandtime").notNull().defaultNow(),
  reason_for_visit: varchar("reason_for_visit", { length: 100 }),
  notes: varchar("notes", { length: 100 }),
 },
 (appointment) => ({
  appointmentIndex: uniqueIndex("appointmentIndex").on(appointment.id),
 })
);

export const EncountersTable = pgTable(
 "encounterDB",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorsTable.id, { onDelete: "cascade" }),
  dateandtime: timestamp("dateandtime").notNull().defaultNow(),
  encounter_type: EncounterEnum("encounterenum").default("inpatient").notNull(),
  chief_complaint: varchar("chief_complaint", { length: 256 }),
  history_of_present_illness: varchar("varchar2", { length: 256 }),
  physical_exam: varchar("physical_exam", { length: 256 }),
  assessment_and_plan: varchar("assessment_and_plan", { length: 2000 }),
  notes: varchar("notes", { length: 1000 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
 },
 (enctr) => ({
  encounterIndex: uniqueIndex("encounterIndex").on(enctr.id),
 })
);

export const DiagnosesTable = pgTable(
 "diagnosis",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  diagnosis_code: varchar("diagnosis_code").notNull(),
  description: varchar("description"),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncountersTable.id, { onDelete: "cascade" }),
 },
 (diagnosis) => ({
  diagnosisIndex: uniqueIndex("diagnosisIndex").on(diagnosis.id),
 })
);

export const ProceduresTable = pgTable(
 "procedure",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  procedure_name: varchar("procedure_name").notNull(),
  procedure_description: varchar("procedure_description"),
  procedure_cost: numeric("procedure_cost").notNull(),
  procedure_duration: time("procedure_duration").notNull(),
  procedure_date: date("procedure_date").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncountersTable.id, { onDelete: "cascade" }),
 },
 (procedures) => ({
  proceduresIndex: uniqueIndex("proceduresIndex").on(procedures.id),
 })
);

export const InsuranceTable = pgTable(
 "insurance",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  company_name: varchar("company_name").notNull(),
  policy_number: varchar("policy_number"),
  group_number: varchar("group_number"),
  phone_number: varchar("phone_number"),
 },
 (insurance) => ({
  insuranceIndex: uniqueIndex("insuranceIndex").on(insurance.id),
 })
);

export const DiagnosisRelations = relations(DiagnosesTable, ({ one }) => ({
 patients: one(PatientsTable, {
  fields: [DiagnosesTable.patient_id],
  references: [PatientsTable.id],
 }),
}));

export const EncountersRelations = relations(EncountersTable, ({ one }) => ({
 patients: one(PatientsTable, {
  fields: [EncountersTable.patient_id],
  references: [PatientsTable.id],
 }),
 doctors: one(DoctorsTable, {
  fields: [EncountersTable.doctor_id],
  references: [DoctorsTable.id],
 }),
}));

export const DoctorsPatientsTable = pgTable(
 "doctorspatients",
 {
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientsTable.id, { onDelete: "cascade" }),
  doctor_id: uuid("doctor_id")
   .notNull()
   .references(() => DoctorsTable.id, { onDelete: "cascade" }),
 },
 (t) => ({
  pk: primaryKey({ columns: [t.patient_id, t.doctor_id] }),
 })
);

export const DoctorsPatientsRelations = relations(
 DoctorsPatientsTable,
 ({ one }) => ({
  patients: one(PatientsTable, {
   fields: [DoctorsPatientsTable.patient_id],
   references: [PatientsTable.id],
  }),

  doctors: one(DoctorsTable, {
   fields: [DoctorsPatientsTable.doctor_id],
   references: [DoctorsTable.id],
  }),
 })
);

export const DoctorsRelations = relations(DoctorsTable, ({ many }) => ({
 appointment: many(AppointmentTable),
 patients: many(PatientsTable),
 encounter: many(EncountersTable),
 doctorspatientstable: many(DoctorsPatientsTable),
}));

export const PatientsRelations = relations(PatientsTable, ({ many }) => ({
 appointment: many(AppointmentTable),
 doctor: many(DoctorsTable),
 encounter: many(EncountersTable),
 medications: many(MedicationsTable),
 allergies: many(AllergiesTable),
 procedures: many(ProceduresTable),
 labs: many(LabsTable),
 immunizations: many(ImmunizationTable),
 insurance: many(InsuranceTable),
 diagnosis: many(DiagnosesTable),
 doctorspatientstable: many(DoctorsPatientsTable),
}));

export const AppointmentsRelations = relations(AppointmentTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [AppointmentTable.patient_id],
  references: [PatientsTable.id],
 }),
 doctor: one(DoctorsTable, {
  fields: [AppointmentTable.doctor_id],
  references: [DoctorsTable.id],
 }),
}));

export const MedicationsRelations = relations(MedicationsTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [MedicationsTable.patient_id],
  references: [PatientsTable.id],
 }),
 doctor: one(DoctorsTable, {
  fields: [AppointmentTable.doctor_id],
  references: [DoctorsTable.id],
 }),
}));

export const AllergiesRelations = relations(AllergiesTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [AllergiesTable.patient_id],
  references: [PatientsTable.id],
 }),
}));
export const ProceduresRelations = relations(ProceduresTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [ProceduresTable.patient_id],
  references: [PatientsTable.id],
 }),
}));
export const LabsRelations = relations(LabsTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [LabsTable.patient_id],
  references: [PatientsTable.id],
 }),
}));
export const ImmunizationsRelations = relations(
 ImmunizationTable,
 ({ one }) => ({
  patient: one(PatientsTable, {
   fields: [ImmunizationTable.patient_id],
   references: [PatientsTable.id],
  }),
 })
);

export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
 patient: one(PatientsTable, {
  fields: [InsuranceTable.patient_id],
  references: [PatientsTable.id],
 }),
}));
