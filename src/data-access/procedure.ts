


 
import db from "@/db";
import { ProcedureTable } from "@/db/schema";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncounterById,  } from "./encouter";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId,  getAppointmentsAndEncountersByProviderId } from "./appointment";
import { insertProcedureSchema } from "@/db/schema/procedure";



export const getProcedure = async () => {
    const diagnosis = await db.query.ProcedureTable.findMany();
    return diagnosis;
}


  export async function createProcedure(EncounterId:string, diagnosisData: object) {
    // Step 1: Fetch the encounter
    const encounter = await getEncounterById(EncounterId);
  
    if (!encounter) {
      throw new NotFoundError();
    }          
       // Now parsedData.data should conform to InsertProcedureDataType
       // Step 3: Create the diagnosis with the (existing or new) encounterId
       const parsedData = insertProcedureSchema.safeParse({...diagnosisData, encounter_id: encounter.id});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertProcedureDataType
       await db.insert(ProcedureTable).values(parsedData.data).returning();

       
  }

  // get diagnosis for an encounter

  export async function getProcedureByEncounterId(encounterId: string): Promise<any[]> {
    const diagnosis = await db.query.ProcedureTable.findMany({
      where: eq(ProcedureTable.encounter_id, encounterId), 
    });
    return diagnosis;
  }




  // get diagnosis for a patient
  // New function to get procedures by patient ID, reusing the abstraction
export async function getProceduresByPatientId(patientId: string) {
    const Encounters = await getAppointmentsAndEncountersByPatientId(patientId);
  
    // Initialize an array to hold all procedures for the patient
    let procedures = [];
  
    // Step 3: For each encounter, get procedures
      for (const encounter of Encounters) {
        const allProcedures = await getProcedureByEncounterId(encounter.id);
        procedures.push(...allProcedures);
      }
    
  
    return procedures;
  }


  
  export async function getProceduresByProviderId(providerId: string) {
    const Encounters = await getAppointmentsAndEncountersByProviderId(providerId);
  
    // Initialize an array to hold all labs for the patient
    let procedures = [];
  
    // Step 3: For each encounter, get labs
      for (const encounter of Encounters) {
        const allProcedures = await getProcedureByEncounterId(encounter.id);
        procedures.push(...allProcedures);
      }
    
  
    return procedures;
  }


  // delete diagnosis
  export const deleteProcedure = async (diagnosisId: string) => {
    await db.delete(ProcedureTable).where(eq(ProcedureTable.id, diagnosisId)).returning();
  }

  // update diagnosis
  export const updateProcedure = async (diagnosisId: string, diagnosisData: object) => {
    await db.update(ProcedureTable).set(diagnosisData).where(eq(ProcedureTable.id, diagnosisId)).returning();
  }