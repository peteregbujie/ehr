import db, { eq } from "@/db";
import { EncounterTable, PatientTable } from "@/db/schema";
import { EncounterTypes, insertEncounterSchema } from "@/db/schema/encounter";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { EncounterId } from "@/use-cases/types";
import { getAppointmentById, getAppointmentsByPhoneNumber, getPatientAppointmentsByPhoneNumber } from "./appointment";
import { NewEncounterType } from "@/lib/validations/encounter";




export const createEncounter = async (encounterData: NewEncounterType) => {
    // destructure the phone number from the encounter data
    const { phone_number } = encounterData;

    const appointmentResults = await getPatientAppointmentsByPhoneNumber(phone_number);

    const { id: firstAppointmentId, provider_id, patient_id } = appointmentResults[0]?.appointments?.[0] || {};


    if (firstAppointmentId) {
        throw new NotFoundError();
      }

      const newEncounterData = {
        ...encounterData,
        provider_id,
        patient_id,
        id: firstAppointmentId,
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


export const getEncounters  = async () => { 
    return await db.query.EncounterTable.findMany()
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



export async function getPatientEncountersByPhoneNumber(
    phone_no:string,
    ) {
    const raw = await db.query.PatientTable.findFirst({
       
    where: (table, {eq}) => eq(table.phone_number, phone_no),
    with: {
      appointments: {
        with: {
          encounter: {
          orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
          }
        },
        },
        },
    
    });
    
    return raw;
    
    }
    