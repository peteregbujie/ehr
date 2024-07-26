
import db from "@/db";
import PatientTable, { insertPatientSchema, PatientTypes } from "@/db/schema/patient";
import { InvalidDataError} from "@/use-cases/errors";
import { PatientId } from "@/use-cases/types";
import { eq } from "drizzle-orm";



 type SanitizedinsertPatientSchema = Omit<PatientTypes, "id"| "created_at"| "updated_at">


export const createPatient = async (data: SanitizedinsertPatientSchema, trx = db) => {
    // Parse the input data against the schema
    const parsedData = insertPatientSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertPatientDataType
    const {notes, height, weight, occupation, family_medical_history, user_id, marital_status, emergency_contact_name, emergency_contact_number, emergency_contact_relationship, blood_type, socialHistory, past_medical_history, primary_care_physician, preferred_language, address} = parsedData.data
    // Now parsedData.data should conform to InsertPatientDataType

    const newPatientData = {
        height: height,
        weight: weight,
        occupation: occupation,
        address: address,
        user_id: user_id,
        marital_status: marital_status,
        emergency_contact_name: emergency_contact_name,
        emergency_contact_number: emergency_contact_number,
        emergency_contact_relationship: emergency_contact_relationship,
        blood_type: blood_type,
        socialHistory: socialHistory ,
        past_medical_history: past_medical_history,
        family_medical_history: family_medical_history,
        primary_care_physician: primary_care_physician,
        preferred_language: preferred_language,
        note: notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    await trx.insert(PatientTable).values(newPatientData).returning();
}

export const updatePatient = async (patientId: string, data: PatientTypes) => {
    // Parse the input data against the schema
    const parsedData = insertPatientSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertPatientDataType
    await db.update(PatientTable).set(parsedData.data).where(eq(PatientTable.id, patientId)).returning();
}

export const deletePatient = async (patientId: string) => {
    await db.delete(PatientTable).where(eq(PatientTable.id, patientId));
}

export const getPatients = async () => {
    const patients = await db.query.PatientTable.findMany();
    return patients;
}

export const getPatientById = async (patientId: PatientId) => {
    const patient = await db.query.PatientTable.findFirst({
        where: eq(PatientTable.id, patientId),
    });

    return patient;
}