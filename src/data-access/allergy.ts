
import { getPatientLatestEncounterId } from "./encouter";
import { InvalidDataError } from "@/use-cases/errors";
import AllergyTable,{ insertAllergySchema }  from "@/db/schema/allergy";
import db, { eq } from "@/db";
import { NewAllergyType } from "@/lib/validations/allergy";

export async function createAllergy( allergyData: NewAllergyType) {

  const encounterId = await getPatientLatestEncounterId();  
   
       // Now parsedData.data should conform to InsertLabDataType
       const parsedData = insertAllergySchema.safeParse({...allergyData, encounter_id: encounterId});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertMedicationDataType
       await db.insert(AllergyTable).values(parsedData.data).returning();

       
  }


  // delete allergy
  export const deleteAllergy = async (allergyId: string) => {
    await db.delete(AllergyTable).where(eq(AllergyTable.id, allergyId)).returning();
  }