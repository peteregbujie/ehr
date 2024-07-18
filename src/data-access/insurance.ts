

// create insurance function. insurance is a related table to patient

import db, { eq } from "@/db";
import InsuranceTable, { insertInsuranceSchema, InsuranceTypes } from "@/db/schema/insurance";
import { getPatientById } from "./patient";
import { NotFoundError } from "@/use-cases/errors";

export async function CreateInsurance (patientId: string, insuranceData: InsuranceTypes) {
   // find patient by id
   const patient = await getPatientById(patientId);
   if (!patient) {
     throw new NotFoundError();
   }

   const parsedData = insertInsuranceSchema.safeParse(insuranceData);

   if (!parsedData.success) {
    // Handle parse failure, possibly throw an error or log it
    throw new Error('Invalid insurance data');
}

   await db.insert(InsuranceTable).values({ ...parsedData.data, patient_id: patientId }).returning();

}


// update insurance function
export async function UpdateInsurance (insuranceId: string, insuranceData: InsuranceTypes) {

    const parsedData = insertInsuranceSchema.safeParse(insuranceData);

    if (!parsedData.success) {
        // Handle parse failure, possibly throw an error or log it
        throw new Error('Invalid insurance data');
    }

    await db.update(InsuranceTable).set(parsedData.data).where(eq(InsuranceTable.id, insuranceId)).returning();
}


// delete insurance function
export async function DeleteInsurance (insuranceId: string) {
    await db.delete(InsuranceTable).where(eq(InsuranceTable.id, insuranceId)).returning();
}   


// get insurance by id
export const getInsuranceById = async (insuranceId: string) => {
    return await db.query.InsuranceTable.findFirst({
        where: eq(InsuranceTable.id, insuranceId)
    })
}