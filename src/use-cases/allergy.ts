import { createAllergy, deleteAllergy } from "@/data-access/allergy"
import { NewAllergyType } from "@/lib/validations/allergy"

export const createAllergyUseCase = async (allergyData: NewAllergyType) => {
    return await createAllergy( allergyData)
}

// delete allergy use case
export const deleteAllergyUseCase = async (allergyId: string) => {
    return await deleteAllergy(allergyId)
}