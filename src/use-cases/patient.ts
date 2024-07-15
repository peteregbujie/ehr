import { createPatient, getPatientById, updatePatient } from "@/data-access/patient";
import { createUser } from "@/data-access/user";
import { createTransaction } from "@/data-access/utils";
import { PatientId } from "./types";




export async function createPatientUseCase(
    data: unknown
) {
    await createTransaction(async (trx) => {
        await createUser(data, trx);
        await createPatient(data, trx);
    });
}

export async function updatePatientUseCase(

    patientId: PatientId,
    data: unknown,
): Promise<void> {

    await updatePatient(patientId, data);
}

export async function getPatientByIdUseCase(

    patientId: PatientId,

) {

    return await getPatientById(patientId);
}

export async function deletePatientUseCase(

    data: unknown,
): Promise<void> {

    await createPatient(data);
}

