
import { createDiagnosis, deleteDiagnosis, getDiagnosesByPatientId, getDiagnosesByProviderId, getDiagnosis, getDiagnosisByEncounterId, updateDiagnosis } from "@/data-access/diagnosis";
import { DiagnosisTypes } from "@/db/schema/diagnosis";



export async function getDiagnosisUseCase() {
    return await getDiagnosis()
}


// get Diagnosiss By Patient Id use case
export const getDiagnosisByPatientIdUseCase = async (patientId: string) => {
    return await getDiagnosesByPatientId(patientId)
}

// create Diagnosis use case
export const createDiagnosisUseCase = async (enounterId: string, diagnosisData: DiagnosisTypes) => {
    return await createDiagnosis(enounterId, diagnosisData)
}


  // get diagnosiss for an encounter use case
  export const getDiagnosisForEncounterUseCase = async (encounterId: string) => {
    return await getDiagnosisByEncounterId(encounterId)
  }

  // get diagnosis by provider id use case
  export const getDiagnosisByProviderIdUseCase = async (providerId: string) => {
    return await getDiagnosesByProviderId(providerId)
  }

  // delete diagnosis use case
  export const deleteDiagnosisUseCase = async (diagnosisId: string) => {
    return await deleteDiagnosis(diagnosisId)
  }

  // update diagnosis use case
  export const updateDiagnosisUseCase = async (diagnosisId: string, diagnosisData: DiagnosisTypes) => {
    return await updateDiagnosis(diagnosisId, diagnosisData)
  }
  