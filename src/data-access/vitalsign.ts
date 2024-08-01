// create vital sign function

import VitalSignsTable, { insertVitalSignSchema, VitalSignTypes } from "@/db/schema/vitalsign";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncounterById, getPatientLatestEncounterId } from "./encouter";
import db, { eq } from "@/db";
import { NewVitalSignType } from "@/lib/validations/vitalsign";
import { searchPatient } from "./patient";


export async function createVitalSign( vitalsignnData: NewVitalSignType) {
  const encounterId = await getPatientLatestEncounterId();  
  
       const parsedData = insertVitalSignSchema.safeParse({...vitalsignnData, encounter_id: encounterId});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertVitalSignDataType
       await db.insert(VitalSignsTable).values(parsedData.data).returning();

       
  }


  // update vital sign function
  export const updateVitalSign = async (vitalSignId: string, vitalSignData: VitalSignTypes) => {

    const parsedData = insertVitalSignSchema.safeParse(vitalSignData);

    if (!parsedData.success) {
      throw new InvalidDataError();
    }   
    await db.update(VitalSignsTable).set(parsedData.data).where(eq(VitalSignsTable.id, vitalSignId)).returning();
  } 

  // delete vital sign function
  export const deleteVitalSign = async (vitalSignId: string) => {
    await db.delete(VitalSignsTable).where(eq(VitalSignsTable.id, vitalSignId)).returning();
  }

  // get all vital signs
  export const getAllVitalSigns = async () => {
    return await db.select().from(VitalSignsTable);
  } 

  //    get vital sign by id
  export const getVitalSignById = async (vitalSignId: string) => {
    return await db.select().from(VitalSignsTable).where(eq(VitalSignsTable.id, vitalSignId));
  } 