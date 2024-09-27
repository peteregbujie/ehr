import { z } from "zod"



export const AppointmentSchema = z.object({
  provider_id: z.string(),
  reason: z.string().   
    min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
    type: z.enum(["new_patient", "follow_up", "annual_physical"]),
    status: z.enum(["scheduled", "cancelled", "completed"]),
    notes: z.string(). min(2, "Note must be at least 2 characters")
    .max(500, "Note must be at most 500 characters"),
    scheduled_date: z.coerce.date(),
    timeSlotIndex: z.string(),
    location: z.string().
    min(2, "Location must be at least 2 characters")
    .max(500, "Location must be at most 50 characters"),
    appointmentId: z.string().optional()
  });
  
  export type NewAppointmentType = z.infer<typeof AppointmentSchema>