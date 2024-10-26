 // create vital sign use case

import { createVitalSign, deleteVitalSign, getVitalSignById, updateVitalSign } from "@/data-access/vitalsign";
import { VitalSignsType } from "@/db/schema/vitalsign";
import { NewVitalSignType } from "@/lib/validations/vitalsign";
import { ExtendedUser } from "@/types/next-auth";

 export async function createVitalSignUseCase ( user:ExtendedUser, vitalSignData: NewVitalSignType) {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
      
    return await createVitalSign( vitalSignData)
}


// update vital sign use case
export async function updateVitalSignUseCase (vitalSignId: string, vitalSignData: VitalSignsType) {
    return await updateVitalSign(vitalSignId, vitalSignData)    
}


// delete vital sign use case
export async function deleteVitalSignUseCase (vitalSignId: string) {
    return await deleteVitalSign(vitalSignId)     
    }


// get vital sign by id use case
export async function getVitalSignByIdUseCase (vitalSignId: string) {
    return await getVitalSignById(vitalSignId)     
    }

    