import { createPatient, getPatientById, updatePatient } from "@/data-access/patient";
import { createUser, getUserByEmail } from "@/data-access/user";
import { createTransaction } from "@/data-access/utils";
import { PatientId } from "./types";
import { PatientTypes } from "@/db/schema/patient";
import { NewPatientType } from "@/lib/validations/patient";
import { createAddress } from "@/data-access/address";




export async function createPatientUseCase(
    data: NewPatientType
) {
    const { 
        full_name,
        email,
        gender,
        date_of_birth,
        phone_number,
        address,
        height,
        weight,
        occupation,
        marital_status,
        emergency_contact_name,
        emergency_contact_relationship,
        emergency_contact_number,
        socialHistory,
        past_medical_history,
        family_medical_history,
        blood_type,
        primary_care_physician,
        preferred_language,
        note } = data;

        

    const userData = {
        full_name,
        email,
        date_of_birth,
        gender
    }
const patientData = {
    phone_number,
    height,
    weight,
    occupation,
    marital_status,
    emergency_contact_name,
    emergency_contact_relationship,
    emergency_contact_number,
    socialHistory,
    past_medical_history,
    family_medical_history,
    blood_type,
    primary_care_physician,
    preferred_language,
    note 
}

const addressData = {
    address_line_1: address
}

      // Check if email already exists
      let existingUser = await getUserByEmail(email);

      let user_id: string;
  
      if (existingUser) {
        // If user exists, use the existing user_id
        user_id = existingUser.id;
      } else {        
        await createTransaction(async (trx) => {
            await createUser({...userData, name: full_name, date_of_birth: new Date(date_of_birth)}, trx);

            const addressResult = await createAddress(addressData);
            const addressId = addressResult.id;

            await createPatient({
                ...patientData, user_id, notes: note, address: addressId
               
            }, trx);
        });
    }

   
}
    


export async function updatePatientUseCase(

    patientId: PatientId,
    data: PatientTypes,
): Promise<void> {

    await updatePatient(patientId, data);
}

export async function getPatientByIdUseCase(

    patientId: PatientId,

) {

    return await getPatientById(patientId);
}

export async function deletePatientUseCase(

    data: PatientTypes,
): Promise<void> {

    await createPatient(data);
}

