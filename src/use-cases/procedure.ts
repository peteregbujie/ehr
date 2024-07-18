
import { createProcedure, deleteProcedure, getProceduresByPatientId, getProceduresByProviderId, getProcedure, getProcedureByEncounterId, updateProcedure } from "@/data-access/procedure";
import { ProcedureTypes } from "@/db/schema/procedure";



export async function getProcedureUseCase() {
    return await getProcedure()
}


// get Procedures By Patient Id use case
export const getProcedureByPatientIdUseCase = async (patientId: string) => {
    return await getProceduresByPatientId(patientId)
}

// create Procedure use case
export const createProcedureUseCase = async (enounterId: string, procedureData: ProcedureTypes) => {
    return await createProcedure(enounterId, procedureData)
}


  // get procedures for an encounter use case
  export const getProcedureForEncounterUseCase = async (encounterId: string) => {
    return await getProcedureByEncounterId(encounterId)
  }

  // get procedure by provider id use case
  export const getProcedureByProviderIdUseCase = async (providerId: string) => {
    return await getProceduresByProviderId(providerId)
  }

  // delete procedure use case
  export const deleteProcedureUseCase = async (procedureId: string) => {
    return await deleteProcedure(procedureId)
  }

  // update procedure use case
  export const updateProcedureUseCase = async (procedureId: string, procedureData: ProcedureTypes) => {
    return await updateProcedure(procedureId, procedureData)
  }
  