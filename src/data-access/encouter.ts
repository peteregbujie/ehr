import db from "@/db";
import { EncounterTable, PatientTable } from "@/db/schema";
import { EncounterTypes, insertEncounterSchema } from "@/db/schema/encounter";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { EncounterId } from "@/use-cases/types";
import {  getPatientLatestAppointment } from "./appointment";
import { NewEncounterType } from "@/lib/validations/encounter";

import { getCurrentUser } from "@/lib/session";
import { searchUser } from "./user";
import { eq } from "drizzle-orm";
import { SelectAppointment } from "@/types";




export const createEncounter = async (encounterData: NewEncounterType) => {

    
    const result = await getPatientLatestAppointment();

  
    const { provider_id, patient_id } = result;

      const newEncounterData = {
        ...encounterData,
        provider_id,
        patient_id,
      
      }

    // Parse the input data against the schema  
    const parsedData = insertEncounterSchema.safeParse(newEncounterData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }   

    // Now parsedData.data should conform to InsertEncounterDataType
    await db.insert(EncounterTable).values(parsedData.data).returning();

}


export const getEncounterById = async (encounterId: EncounterId) => {
    const encounter = await db.query.EncounterTable.findFirst({
        where: eq(EncounterTable.id, encounterId),
    });

    return encounter;
}


export const updateEncounter = async (encounterId: EncounterId, data: EncounterTypes) => {
    // Parse the input data against the schema  
    const parsedData = insertEncounterSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertEncounterDataType
    await db.update(EncounterTable).set(parsedData.data).where(eq(EncounterTable.id, encounterId)).returning();
}


export const deleteEncounter = async (encounterId: EncounterId) => {
    await db.delete(EncounterTable).where(eq(EncounterTable.id, encounterId)).returning();
}


// get encounters by appointment id
export const getEncountersByAppointmentId = async (appointmentId: string) => {
    return await db.query.EncounterTable.findMany({
        where: eq(EncounterTable.appointment_id, appointmentId),
    });
}



export async function getPatientLatestEncounterId() {

    const currentUser = await getCurrentUser()

    const email = currentUser?.email

    try {
        const user = await searchUser(email);
        if (!user) {
            throw new NotFoundError();
            
        }

        const firstPatient = user.patient;
const firstAppointment = firstPatient.appointments[0] as SelectAppointment
const latestEncounterId = firstAppointment.encounter[0].id;
       
        return latestEncounterId;
    } catch (error) {
        throw new InvalidDataError();
    }
}


