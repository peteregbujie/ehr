import { createEncounter, deleteEncounter, getEncounterById, getEncountersByAppointmentId, updateEncounter,  } from "@/data-access/encouter";
import { EncounterId,  } from "./types";
import { EncounterTypes } from "@/db/schema/encounter";
import { NewEncounterType } from "@/lib/validations/encounter";
import { ExtendedUser } from "@/types/next-auth";



export async function createEncounterUseCase(
user: ExtendedUser, encounterData: NewEncounterType,
    
) {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
      
    await createEncounter(encounterData)         
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

