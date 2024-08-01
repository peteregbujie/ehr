

 
import db from "@/db";
import { LabTable } from "@/db/schema";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncounterById, getPatientLatestEncounterId } from "./encouter";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId, getAppointmentByPatientId, getAppointmentsAndEncountersByProviderId } from "./appointment";
import { insertLabSchema, LabTypes } from "@/db/schema/labs";
import { searchPatient } from "./patient";
import { NewLabType } from "@/lib/validations/lab";




export const getLab = async () => {
    const lab = await db.query.LabTable.findMany();
    return lab;
}


  export async function createLab( labData: NewLabType) {
      
    
   const encounterId = await getPatientLatestEncounterId();  
   
   
       // Now parsedData.data should conform to InsertLabDataType
       const parsedData = insertLabSchema.safeParse({...labData, encounter_id: encounterId});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertMedicationDataType
       await db.insert(LabTable).values(parsedData.data).returning();

       
  }

  // get lab for an encounter

  export async function getLabByEncounterId(encounterId: string){
    const lab = await db.query.LabTable.findMany({
      where: eq(LabTable.encounter_id, encounterId), 
    });
    return lab;
  }




export async function getLabsByPatientId(patientId: string) {
    const Encounters = await getAppointmentsAndEncountersByPatientId(patientId);
  
    // Initialize an array to hold all labs for the patient
    let labs = [];
  
    // Step 3: For each encounter, get labs
      for (const encounter of Encounters) {
        const allLabs = await getLabByEncounterId(encounter.id);
        labs.push(...allLabs);
      }
    
  
    return labs;
  }



  //get lab by provider

  export async function getLabsByProviderId(providerId: string) {
    const Encounters = await getAppointmentsAndEncountersByProviderId(providerId);
  
    // Initialize an array to hold all labs for the patient
    let labs = [];
  
    // Step 3: For each encounter, get labs
      for (const encounter of Encounters) {
        const allLabs = await getLabByEncounterId(encounter.id);
        labs.push(...allLabs);
      }
    
  
    return labs;
  }


  // delete lab
  export const deleteLab = async (labId: string) => {
    await db.delete(LabTable).where(eq(LabTable.id, labId)).returning();
  }


  // update lab
  export const updateLab = async (labId: string, labData: LabTypes) => {
    await db.update(LabTable).set(labData).where(eq(LabTable.id, labId)).returning();
  }
  