

// create diagnosis check if encounter exists
// create diagnosis with encounter id
 
import db from "@/db";
import { DiagnosisTable, PatientTable } from "@/db/schema";

import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncounterById, getEncountersByAppointmentId } from "./encouter";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId, getAppointmentByPatientId } from "./appointment";
import { insertDiagnosisSchema } from "@/db/schema/diagnosis";



export const getDiagnosis = async () => {
    const diagnosis = await db.query.DiagnosisTable.findMany();
    return diagnosis;
}


  export async function createDiagnosis(EncounterId:string, diagnosisData: object) {
    // Step 1: Fetch the encounter
    const encounter = await getEncounterById(EncounterId);
  
    if (!encounter) {
      throw new NotFoundError();
    }          
       // Now parsedData.data should conform to InsertDiagnosisDataType
       // Step 3: Create the diagnosis with the (existing or new) encounterId
       const parsedData = insertDiagnosisSchema.safeParse({...diagnosisData, encounter_id: encounter.id});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertDiagnosisDataType
       await db.insert(DiagnosisTable).values(parsedData.data).returning();

       
  }

  // get diagnosis for an encounter

  export async function getDiagnosisByEncounterId(encounterId: string): Promise<any[]> {
    const diagnosis = await db.query.DiagnosisTable.findMany({
      where: eq(DiagnosisTable.encounter_id, encounterId), 
    });
    return diagnosis;
  }




  // get diagnosis for a patient
  // New function to get diagnoses by patient ID, reusing the abstraction
export async function getDiagnosesByPatientId(patientId: string) {
    const Encounters = await getAppointmentsAndEncountersByPatientId(patientId);
  
    // Initialize an array to hold all diagnoses for the patient
    let diagnoses = [];
  
    // Step 3: For each encounter, get diagnoses
      for (const encounter of Encounters) {
        const allDiagnoses = await getDiagnosisByEncounterId(encounter.id);
        diagnoses.push(...allDiagnoses);
      }
    
  
    return diagnoses;
  }