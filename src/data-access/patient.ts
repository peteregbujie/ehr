
import db from "@/db";
import PatientTable, { insertPatientSchema } from "@/db/schema/patient";
import { InvalidDataError } from "@/use-cases/errors";
import { PatientId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

export const createPatient = async (data: unknown, trx = db) => {
    // Parse the input data against the schema
    const parsedData = insertPatientSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertPatientDataType
    await trx.insert(PatientTable).values(parsedData.data).returning();
}

export const updatePatient = async (patientId: string, data: unknown) => {
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