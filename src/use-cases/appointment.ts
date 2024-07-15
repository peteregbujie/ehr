import { createAppointment, deleteAppointment, getAllAppointments, getAppointmentById,  getAppointmentByPatientId,  getAppointmentByProviderId, updateAppointment } from "@/data-access/appointment";


// get all appointments use case
export async function getAlltAppointmentsUseCase ()  {
    return await getAllAppointments()
}

// get appointment by id use case
export async function getAppointmentByIdUseCase (appointmentId: string) {
    return await getAppointmentById(appointmentId)
}

// update appointment use case
export async function updateAppointmentUseCase (appointmentId: string, data: object) {
    return await updateAppointment(appointmentId, data)
}

// delete appointment use case
export async function deleteAppointmentUseCase (appointmentId: string) {
    return await deleteAppointment(appointmentId)       
}

// create appointment use case
export async function createAppointmentUseCase (data: object) {
    return await createAppointment(data)
}

// get appointment by provider use case
export async function getAppointmentByProviderIdUseCase (providerId: string) {
    return await getAppointmentByProviderId(providerId)
}


// get appointment by patient use case  
export async function getAppointmentByPatientIdUseCase (patientId: string) {
    return await getAppointmentByPatientId(patientId)
}   
