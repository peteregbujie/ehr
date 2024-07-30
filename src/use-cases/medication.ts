import { createMedication, getMedicationsByPatientId, getMedications, getMedicationsByEncounterId, deleteMedication, updateMedication } from "@/data-access/medication";
import { NewMedicationType } from "@/lib/validations/medication";



export async function getMedicationUseCase() {
    return await getMedications()
}


// get Medications By Patient Id use case
export const getMedicationsByPatientIdUseCase = async (patientId: string) => {
    return await getMedicationsByPatientId(patientId)
}

// create Medication use case
export const createMedicationUseCase = async ( medicationData: NewMedicationType) => {
    return await createMedication( medicationData)
}


  // get medications for an encounter use case
  export const getMedicationsForEncounterUseCase = async (encounterId: string) => {
    return await getMedicationsByEncounterId(encounterId)
  }

  // delete medication use case
  export const deleteMedicationUseCase = async (medicationId: string) => {
    return await deleteMedication(medicationId)
  }

  // update medication use case
  export const updateMedicationUseCase = async (medicationId: string, medicationData: NewMedicationType) => {
    return await updateMedication(medicationId, medicationData)   

  }