export { default as AdminTable, AdminsRelations } from "./admin";
export { AllergiesRelations, default as AllergiesTable } from "./allergy";
export {
    AppointmentRelations,
    default as AppointmentTable
} from "./appointment";
export { DiagnosisRelations, default as DiagnosisTable } from "./diagnosis";
export { AccountsTable, SessionsTable, default as UserTable, UsersRelations, VerificationTokensTable, userRoles, gender_id } from "./user";

export {
    ProviderPatientRelations,
    default as ProviderPatientTable
} from "./provider_patient";

export { default as ProviderTable, providerRelations } from "./provider";

export { EncounterRelations, default as EncounterTable } from "./encounter";

export {
    ImmunizationRelations,
    default as ImmunizationTable
} from "./immunization";

export { InsuranceRelations, default as InsuranceTable } from "./insurance";

export { LabRelations, default as LabTable } from "./labs";

export { MedicationRelations, default as MedicationTable } from "./medication";

export { VitalSignRelations, default as VitalSignTable } from "./vitalsign";

export { PatientRelations, default as PatientTable } from "./patient";

export { ProcedureRelations, default as ProcedureTable } from "./procedure";

