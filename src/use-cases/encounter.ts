import { createEncounter, deleteEncounter, getEncounterById, getEncountersByAppointmentId, updateEncounter,  } from "@/data-access/encouter";
import { EncounterId,  } from "./types";
import { EncounterTypes } from "@/db/schema/encounter";



export async function createEncounterUseCase(
    encounterData: EncounterTypes,
    AppointmentId: string
) {
    await createEncounter(encounterData, AppointmentId)         
}

export async function updateEcnounterUseCase(
   
    encounterId: EncounterId, data: EncounterTypes
) {
    await updateEncounter( encounterId, data)     
}


export async function  getEncounterByIdUseCase(encounterId: EncounterId) {

    return await getEncounterById(encounterId)  
}


export async function deleteEncounterUseCase(encounterId: EncounterId) {
    await deleteEncounter(encounterId)
}


// get encounters by appointment id use case
export async function getEncountersByAppointmentIdUseCase(appointmentId: string) {
    return await getEncountersByAppointmentId(appointmentId)
}

