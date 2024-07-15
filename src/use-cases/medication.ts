import { createMedication, fetchMedicationsByPatientId, getMedications, getMedicationsByEncounterId } from "@/data-access/medication";



export async function getMedicationUseCase() {
    return await getMedications()
}


// fetch Medications By Patient Id use case
export const fetchMedicationsByPatientIdUseCase = async (patientId: string) => {
    return await fetchMedicationsByPatientId(patientId)
}

// create Medication use case
export const createMedicationUseCase = async (enounterId: string, medicationData: object) => {
    return await createMedication(enounterId, medicationData)
}


  // get medications for an encounter use case
  export const getMedicationsForEncounterUseCase = async (encounterId: string) => {
    return await getMedicationsByEncounterId(encounterId)
  }