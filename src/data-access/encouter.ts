import db, { eq } from "@/db";
import { EncounterTable } from "@/db/schema";
import { EncounterTypes, insertEncounterSchema } from "@/db/schema/encounter";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { EncounterId } from "@/use-cases/types";
import { getAppointmentById } from "./appointment";




export const createEncounter = async (encounterData: EncounterTypes, AppointmentId:string) => {

    const appointment = await getAppointmentById(AppointmentId);

    if (!appointment) {
        throw new NotFoundError();
      }


    // Parse the input data against the schema  
    const parsedData = insertEncounterSchema.safeParse(encounterData);

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