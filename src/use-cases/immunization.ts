import { createImmunization } from "@/data-access/immunization"
import { NewImmunizationType } from "@/lib/immunization"

// create Immunization use case
export const createImmunizationUseCase = async (immunizationData: NewImmunizationType) => {
    return await createImmunization(immunizationData)   
}
