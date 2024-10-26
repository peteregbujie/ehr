
import { createProcedure, deleteProcedure, getProceduresByPatientId, getProceduresByProviderId, getProcedure, getProcedureByEncounterId, updateProcedure } from "@/data-access/procedure";
import { ProcedureType } from "@/db/schema/procedure";
import { NewProcedureType } from "@/lib/validations/procedure";
import { ExtendedUser } from "@/types/next-auth";



export async function getProcedureUseCase() {
    return await getProcedure()
}


// get Procedures By Patient Id use case
export const getProcedureByPatientIdUseCase = async (patientId: string) => {
    return await getProceduresByPatientId(patientId)
}

// create Procedure use case
export const createProcedureUseCase = async ( user: ExtendedUser, procedureData: NewProcedureType) => {
  
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
    return await createProcedure( procedureData)
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
  export const updateProcedureUseCase = async (procedureId: string, procedureData: ProcedureType) => {
    return await updateProcedure(procedureId, procedureData)
  }
  