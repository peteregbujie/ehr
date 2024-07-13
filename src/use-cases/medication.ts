import { createMedication, getMedications } from "@/data-access/medication";



export async function createMedicationUseCase(data: unknown) {
    await createMedication(data)
}

export async function getMedicationUseCase() {
    return await getMedications()
}