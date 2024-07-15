import db, { eq } from "@/db";
import AppointmentTable, { insertAppointmentSchema } from "@/db/schema/appointment";
import { InvalidDataError } from "@/use-cases/errors";
import { getEncountersByAppointmentId } from "./encouter";


//create appointment
export const createAppointment = async (appointmentData: object) => {
    // Parse the input data against the schema
    const parsedData = insertAppointmentSchema.safeParse(appointmentData); 

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertAppointmentDataType
    await db.insert(AppointmentTable).values(parsedData.data).returning();
}


//get all appointments
export const getAllAppointments = async () => {
    return await db.query.AppointmentTable.findMany();
}   

//get appointment by provider
export const getAppointmentByProviderId = async (providerId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.provider_id, providerId)
      });
}   

//get appointment by client
export const getAppointmentByPatientId = async (PaitentId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.patient_id, PaitentId) 
      });
}

//get appointment by id
export const getAppointmentById = async (appointmentId: string) => {
    return await db.query.AppointmentTable.findFirst({
        where: eq(AppointmentTable.id, appointmentId)
      });
}


//update appointment
export const updateAppointment = async (appointmentId: string, appointmentData: object) => {
    // Parse the input data against the schema  
    const parsedData = insertAppointmentSchema.safeParse(appointmentData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertAppointmentDataType
    await db.update(AppointmentTable).set(parsedData.data).where(eq(AppointmentTable.id, appointmentId)).returning();

}

//delete appointment
export const deleteAppointment = async (appointmentId: string) => {
    await db.delete(AppointmentTable).where(eq(AppointmentTable.id, appointmentId)).returning();
}


// Abstract function to get appointments and encounters for a patient
export async function getAppointmentsAndEncountersByPatientId(patientId: string) {
    // Step 1: Fetch all appointments for the patient
    const appointments = await getAppointmentByPatientId(patientId);
  
    // Initialize an array to hold all appointments and encounters for the patient
    let results = [];
  
    // Step 2: For each appointment, get encounters
    for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      results.push(...encounters);
    }
  
    return results;
  }

