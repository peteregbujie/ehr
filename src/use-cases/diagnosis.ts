
import { createDiagnosis, getDiagnosesByPatientId, getDiagnosis, getDiagnosisByEncounterId } from "@/data-access/diagnosis";



export async function getDiagnosisUseCase() {
    return await getDiagnosis()
}


// get Diagnosiss By Patient Id use case
export const getDiagnosisByPatientIdUseCase = async (patientId: string) => {
    return await getDiagnosesByPatientId(patientId)
}

// create Diagnosis use case
export const createDiagnosisUseCase = async (enounterId: string, diagnosisData: object) => {
    return await createDiagnosis(enounterId, diagnosisData)
}


  // get diagnosiss for an encounter use case
  export const getDiagnosisForEncounterUseCase = async (encounterId: string) => {
    return await getDiagnosisByEncounterId(encounterId)
  }