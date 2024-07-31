 // create vital sign use case

import { createVitalSign, deleteVitalSign, getVitalSignById, updateVitalSign } from "@/data-access/vitalsign";
import { VitalSignTypes } from "@/db/schema/vitalsign";
import { NewVitalSignType } from "@/lib/validations/vitalsign";

 export async function createVitalSignUseCase ( vitalSignData: NewVitalSignType) {
    return await createVitalSign( vitalSignData)
}


// update vital sign use case
export async function updateVitalSignUseCase (vitalSignId: string, vitalSignData: VitalSignTypes) {
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

    