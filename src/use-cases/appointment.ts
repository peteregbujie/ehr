import { bookAppointment, deleteAppointment, getAllAppointments, getAppointmentById,  getAppointmentByPatientId,  getAppointmentByProviderId, getAvailableTimeSlots, updateAppointment } from "@/data-access/appointment";
import { AppointmentTypes } from "@/db/schema/appointment";
import { NewAppointmentType } from "@/lib/validations/appointment";


// get all appointments use case
export async function getAlltAppointmentsUseCase ()  {
    return await getAllAppointments()
}

// get appointment by id use case
export async function getAppointmentByIdUseCase (appointmentId: string) {
    return await getAppointmentById(appointmentId)
}

// update appointment use case
export async function updateAppointmentUseCase (appointmentId: string, data: AppointmentTypes) {
    return await updateAppointment(appointmentId, data)
}

// delete appointment use case
export async function deleteAppointmentUseCase (appointmentId: string) {
    return await deleteAppointment(appointmentId)       
}

// create appointment use case

export async function bookAppointmentUseCase (data: NewAppointmentType) {
    return await bookAppointment(data)
}

// get appointment by provider use case
export async function getAppointmentByProviderIdUseCase (providerId: string) {
    return await getAppointmentByProviderId(providerId)
}


// get appointment by patient use case  
export async function getAppointmentByPatientIdUseCase (patientId: string) {
    return await getAppointmentByPatientId(patientId)
}   


export async function getAvailableTimeSlotsUseCase (providerId: string, date: string) {
    return await getAvailableTimeSlots(providerId, date)
}