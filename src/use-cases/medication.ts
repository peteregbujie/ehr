import { createMedication, getMedicationsByPatientId, getMedications, getMedicationsByEncounterId } from "@/data-access/medication";



export async function getMedicationUseCase() {
    return await getMedications()
}


// get Medications By Patient Id use case
export const getMedicationsByPatientIdUseCase = async (patientId: string) => {
    return await getMedicationsByPatientId(patientId)
}

// create Medication use case
export const createMedicationUseCase = async (enounterId: string, medicationData: object) => {
    return await createMedication(enounterId, medicationData)
}


  // get medications for an encounter use case
  export const getMedicationsForEncounterUseCase = async (encounterId: string) => {
    return await getMedicationsByEncounterId(encounterId)
  }