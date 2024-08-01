import { NewImmunizationType } from "@/lib/immunization";
import { getPatientLatestEncounterId } from "./encouter";
import { InvalidDataError } from "@/use-cases/errors";
import ImmunizationTable, { insertImmunizationSchema } from "@/db/schema/immunization";
import db, { eq } from "@/db";



export async function createImmunization( labData: NewImmunizationType) {
  const encounterId = await getPatientLatestEncounterId();  
   
       // Now parsedData.data should conform to InsertLabDataType
       const parsedData = insertImmunizationSchema.safeParse({...labData, encounter_id: encounterId});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertMedicationDataType
       await db.insert(ImmunizationTable).values(parsedData.data).returning();

       
  }


  // delete immunization
  export const deleteImmunization = async (immunizationId: string) => {
    await db.delete(ImmunizationTable).where(eq(ImmunizationTable.id, immunizationId)).returning();
  }