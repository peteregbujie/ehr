
import { createProcedure, deleteProcedure, getProceduresByPatientId, getProceduresByProviderId, getProcedure, getProcedureByEncounterId, updateProcedure } from "@/data-access/procedure";



export async function getProcedureUseCase() {
    return await getProcedure()
}


// get Procedures By Patient Id use case
export const getProcedureByPatientIdUseCase = async (patientId: string) => {
    return await getProceduresByPatientId(patientId)
}

// create Procedure use case
export const createProcedureUseCase = async (enounterId: string, diagnosisData: object) => {
    return await createProcedure(enounterId, diagnosisData)
}


  // get diagnosiss for an encounter use case
  export const getProcedureForEncounterUseCase = async (encounterId: string) => {
    return await getProcedureByEncounterId(encounterId)
  }

  // get diagnosis by provider id use case
  export const getProcedureByProviderIdUseCase = async (providerId: string) => {
    return await getProceduresByProviderId(providerId)
  }

  // delete diagnosis use case
  export const deleteProcedureUseCase = async (diagnosisId: string) => {
    return await deleteProcedure(diagnosisId)
  }

  // update diagnosis use case
  export const updateProcedureUseCase = async (diagnosisId: string, diagnosisData: object) => {
    return await updateProcedure(diagnosisId, diagnosisData)
  }
  