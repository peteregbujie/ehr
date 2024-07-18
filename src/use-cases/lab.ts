
import { createLab, getLabsByPatientId, getLab, getLabByEncounterId, getLabsByProviderId, deleteLab, updateLab } from "@/data-access/lab"
import { LabTypes } from "@/db/schema/labs"



export async function getLabUseCase() {
    return await getLab()
}


// get Labs By Patient Id use case
export const getLabByPatientIdUseCase = async (patientId: string) => {
    return await getLabsByPatientId(patientId)
}


// get lab by provider id use case
export const getLabByProviderIdUseCase = async (providerId: string) => {
    return await getLabsByProviderId(providerId)
}

// create Lab use case
export const createLabUseCase = async (enounterId: string, labData: LabTypes) => {
    return await createLab(enounterId, labData)
}


  // get labs for an encounter use case
  export const getLabForEncounterUseCase = async (encounterId: string) => {
    return await getLabByEncounterId(encounterId)
  }

  // delete lab use case
  export const deleteLabUseCase = async (labId: string) => {
    return await deleteLab(labId)
  }


  // update lab use case
  export const updateLabUseCase = async (labId: string, labData: LabTypes) => {
    return await updateLab(labId, labData)
  }