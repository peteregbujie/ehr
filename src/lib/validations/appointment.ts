import * as z from "zod";


export const AppointmentSchema = z.object({
  reason: z.string(),
    patient_id: z.string(),
    provider_id: z.string(),
    type: z.enum(["new_patient", "follow_up", "annual_physical"]),
    status: z.enum(["scheduled", "cancelled", "completed"]),
    notes: z.string(),
    scheduled_date: z.string().date(),
    timeSlotIndex: z.number().min(0, 'Time slot is required'),
    location: z.string(),
  });

  export type NewAppointmentType = z.infer<typeof AppointmentSchema>;