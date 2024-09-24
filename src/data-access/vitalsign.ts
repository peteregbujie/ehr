// create vital sign function

import VitalSignsTable, { insertVitalSignSchema, VitalSignsType } from "@/db/schema/vitalsign";
import { InvalidDataError} from "@/use-cases/errors";
import {  getPatientLatestEncounterId } from "./encouter";
import db from "@/db";
import { NewVitalSignType } from "@/lib/validations/vitalsign";
import { searchPatient } from "./patient";
import { eq } from "drizzle-orm";


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
  export const updateVitalSign = async (vitalSignId: string, vitalSignData: VitalSignsType) => {

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