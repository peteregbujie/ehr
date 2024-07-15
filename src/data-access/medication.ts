import db from "@/db";
import { MedicationTable, PatientTable } from "@/db/schema";
import { insertMedicationSchema, selectMedicationSchema } from "@/db/schema/medication";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { createEncounter, getEncounterById, getEncountersByAppointmentId } from "./encouter";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId, getAppointmentByPatientId } from "./appointment";



export const getMedications = async () => {
    const medications = await db.query.MedicationTable.findMany();
    return medications;
}


  export async function createMedication(EncounterId:string, medicationData: object) {
    // Step 1: Fetch the encounter
    const encounter = await getEncounterById(EncounterId);
  
    if (!encounter) {
      throw new NotFoundError();
    }          
       // Now parsedData.data should conform to InsertMedicationDataType
       // Step 3: Create the medication with the (existing or new) encounterId
       const parsedData = insertMedicationSchema.safeParse({...medicationData, encounter_id: encounter.id});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertMedicationDataType
       await db.insert(MedicationTable).values(parsedData.data).returning();

       
  }

  // get medications for an encounter

  export async function getMedicationsByEncounterId(encounterId: string): Promise<any[]> {
    const medications = await db.query.MedicationTable.findMany({
      where: eq(MedicationTable.encounter_id, encounterId), 
    });
    return medications;
  }




  // get medications for a patient
  
/* export async function getMedicationsByPatientId(patientId: string) {
  // Step 1: Fetch all appointments for the patient
  const appointments = await getAppointmentByPatientId(patientId);
  
  // Initialize an array to hold all medications for the patient
  let medications = [];
  
  // Step 2: For each appointment, get encounters
  for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      
      // Step 3: For each encounter, get medications
      for (const encounter of encounters) {
          constallMedications = await getMedicationsByEncounterId(encounter.id);
          medications.push(...getedMedications);
      }
  }
  
  return medications;
} */


  //refactored the above function by abstracting the first two steps into a getAppointmentsAndEncountersByPatientId function

export async function getMedicationsByPatientId(patientId: string) {
  const Encounters = await getAppointmentsAndEncountersByPatientId(patientId);

  // Initialize an array to hold all medications for the patient
  let medications = [];

  // Step 3: For each set of appointments and encounters, get medications
 
    for (const encounter of Encounters) {
      const allMedications = await getMedicationsByEncounterId(encounter.id);
      medications.push(...allMedications);
    }
  
    

  return medications;
}


// delete medication
export const deleteMedication = async (medicationId: string) => {
    await db.delete(MedicationTable).where(eq(MedicationTable.id, medicationId)).returning();
}

// update medication
export const updateMedication = async (medicationId: string, medicationData: object) => {
    await db.update(MedicationTable).set(medicationData).where(eq(MedicationTable.id, medicationId)).returning();
}