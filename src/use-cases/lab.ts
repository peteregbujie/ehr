
import { createLab, getLabsByPatientId, getLab, getLabByEncounterId, getLabsByProviderId, deleteLab, updateLab } from "@/data-access/lab"
import { LabType } from "@/db/schema/labs"
import { NewLabType } from "@/lib/validations/lab"
import { ExtendedUser } from "@/types/next-auth"



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
export const createLabUseCase = async (user: ExtendedUser, labData: NewLabType) => {
 
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
    return await createLab( labData)
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
  export const updateLabUseCase = async (labId: string, labData: LabType) => {
    return await updateLab(labId, labData)
  }