import db from "@/db";
import AppointmentTable, { AppointmentTypes, insertAppointmentSchema } from "@/db/schema/appointment";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncountersByAppointmentId } from "./encouter";
import { NewAppointmentType } from "@/lib/validations/appointment";
import PatientTable from "@/db/schema/patient";
import { getCurrentUser } from "@/lib/session";
import { searchUser } from "./user";
import { parseISO, formatISO, getDay } from 'date-fns';
import { eq, and  } from 'drizzle-orm';


const workingHours = [
  { slot: 0, time: '09:00:00' },
  { slot: 1, time: '10:00:00' },
  { slot: 2, time: '11:00:00' },
  { slot: 3, time: '12:00:00' },
  { slot: 4, time: '13:00:00' },
  { slot: 5, time: '14:00:00' },
  { slot: 6, time: '15:00:00' },
  { slot: 7, time: '16:00:00' },
  { slot: 8, time: '17:00:00' },
];


//create appointment
export const bookAppointment = async (appointmentData: NewAppointmentType) => { 

  const { patient_id, provider_id, scheduled_date, reason,  location, timeSlotIndex,  type, status, notes } = appointmentData;

  const parsedDate = parseISO(scheduled_date);
  const dayOfWeek = getDay(parsedDate);

 

  // Check if the appointment falls within the provider's working hours
  if (dayOfWeek < 1 || dayOfWeek > 6) {
    throw new Error('Provider only works Monday to Saturday.');
  }

 // Check if the time slot is already booked
  const existingAppointments = await db.select().from(AppointmentTable).where(
    and(
      eq(AppointmentTable.provider_id, provider_id),
      eq(AppointmentTable.timeSlotIndex, String(timeSlotIndex)),
      eq(AppointmentTable.scheduled_date, formatISO(parsedDate, { representation: 'date' }),),
    )
  );

  if (existingAppointments.length > 0) {
    throw new Error('The selected time slot is already booked.');
  }


  const appointment = await db.insert(AppointmentTable).values({
    patient_id: patient_id,
    provider_id: provider_id,
    scheduled_date: formatISO(parsedDate, { representation: 'date' }),
    timeSlotIndex: String(timeSlotIndex),
    reason: reason,
    type: type,
    status: status,
    notes: notes,
    location: location
  }).returning();

  return appointment;

  
}


export async function getAvailableTimeSlots(providerId: string, date: string) {
  const parsedDate = parseISO(date);
  const dayOfWeek = getDay(parsedDate);

  // Check if the appointment falls within the provider's working hours
  if (dayOfWeek < 1 || dayOfWeek > 6) {
    throw new Error('Provider only works Monday to Saturday.');
  }

  // Fetch booked time slots
  const bookedSlots = await db.select().from(AppointmentTable).where(
    and(
      eq(AppointmentTable.provider_id, providerId),      
      eq(AppointmentTable.scheduled_date, formatISO(parsedDate, { representation: 'date' }),),
    )
);

  // Get available slots
  const bookedSlotIndexes = bookedSlots.map(slot => slot.timeSlotIndex);
  const availableSlots = workingHours.filter(slot => !bookedSlotIndexes.includes(slot.slot.toString()));

  return availableSlots;
}



//get all appointments
export const getAllAppointments = async () => {
    return await db.query.AppointmentTable.findMany();
}   

//get appointment by provider
export const getAppointmentByProviderId = async (providerId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.provider_id, providerId),
        orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
      });
}   

//get appointment by client
export const getAppointmentByPatientId = async (PaitentId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.patient_id, PaitentId) ,
        orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
      });
}

//get appointment by id
export const getAppointmentById = async (appointmentId: string) => {
    return await db.query.AppointmentTable.findFirst({
        where: eq(AppointmentTable.id, appointmentId)
      });
}


//update appointment
export const updateAppointment = async (appointmentId: string, appointmentData: AppointmentTypes) => {
    // Parse the input data against the schema  
    const parsedData = insertAppointmentSchema.safeParse(appointmentData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertAppointmentDataType
    await db.update(AppointmentTable).set(parsedData.data).where(eq(AppointmentTable.id, appointmentId)).returning();

}

//delete appointment
export const deleteAppointment = async (appointmentId: string) => {
    await db.delete(AppointmentTable).where(eq(AppointmentTable.id, appointmentId)).returning();
}


// Abstract function to get appointments and encounters for a patient
export async function getAppointmentsAndEncountersByPatientId(patientId: string) {
    // Step 1: Fetch all appointments for the patient
    const appointments = await getAppointmentByPatientId(patientId);
  
    // Initialize an array to hold all appointments and encounters for the patient
    let results = [];
  
    // Step 2: For each appointment, get encounters
    for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      results.push(...encounters);
    }
  
    return results;
  }


  export async function getAppointmentsAndEncountersByProviderId(providerId: string) {
    // Step 1: Fetch all appointments for the patient
    const appointments = await getAppointmentByProviderId(providerId);
  
    // Initialize an array to hold all appointments and encounters for the patient
    let results = [];
  
    // Step 2: For each appointment, get encounters
    for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      results.push(...encounters);
    }
  
    return results;
  }


export async function getAppointmentsByPhoneNumber(phoneNumber: string) {
  const patientData = await db.query.PatientTable.findMany({where: eq(PatientTable.phone_number, phoneNumber)})

const PatientId = patientData[0]?.id
  if (!PatientId) throw new NotFoundError();

  const appointments = await getAppointmentsAndEncountersByPatientId(PatientId)
  return appointments;
}


export async function getPatientAppointmentsByPhoneNumber(
  phone_number:string,
  ) {
  const raw = await db.query.PatientTable.findMany({
  where: (PatientTable, {eq}) => eq(PatientTable.phone_number, phone_number),
  with: {
    appointments: {
      orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
   
    },
    },
  
  });
  
  return raw;
  
  }
  


export async function getPatientEncountersByPhoneNumber(
  phone_number:string,
  ) {
  const raw = await db.query.PatientTable.findFirst({
  where: (PatientTable, {eq}) => eq(PatientTable.phone_number, phone_number),
  with: {
    appointments: {
      orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
    with: {
      encounter: {
      orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
    }
    },
    },
    },
  
  });
  
  return raw;
  
  }
  

  export async function getPatientLatestAppointment() {

    const currentUser = await getCurrentUser()

    const email = currentUser?.email

    try {
        const user = await searchUser(email);
        if (!user) {
            throw new NotFoundError();
            
        }

        const firstPatient = user.patients[0];
const latestAppointment = firstPatient.appointments[0];
       
const { provider_id, patient_id } = latestAppointment 

// Return the latest appointment along with provider_id and patient_id
return { latestAppointment, provider_id, patient_id };
    } catch (error) {
      throw new InvalidDataError();
    }
}




/* export const getAvailableTimeSlots = async (providerId:string, date:string) => {
  try {
    
    const bookedSlots = await db.query.AppointmentTable.findMany({
      where: and(
        eq(AppointmentTable.provider_id, providerId),
        eq(AppointmentTable.scheduled_date, date)
      )
    });

    const bookedSlotIndexes = bookedSlots.map(slot => slot.timeSlotIndex);
    const availableSlots = workingHours.filter(slot => !bookedSlotIndexes.includes(slot.slot.toString()));

    return availableSlots;
   
  } catch (error) {
    throw new NotFoundError();
  }
};
 */