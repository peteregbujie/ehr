import { isAdminProcedure } from "@/lib/safe-action";
import { createAppointmentUseCase } from "@/use-cases/appointment";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export const createAppointmentAction = isAdminProcedure
  .createServerAction()
  .input(
    z.object({  
      reason: z.string(), 
      patient_id: z.string(),
      provider_id: z.string(),
      type:z.enum(["new_patient", "follow_up", "annual_physical"]),
    status: z.enum(["scheduled", "cancelled", "completed"]),    
    notes: z.string(),
    scheduled_date: z.string().date(),
    scheduled_time: z.string().date(),
    location: z.string()

    })
  )
  .handler(async ({ input: {  reason, patient_id, provider_id, type, status, notes, scheduled_date, scheduled_time, location } }) => {
    await createAppointmentUseCase( {
        reason, patient_id, provider_id, type, status, notes, scheduled_date, scheduled_time, location,
    });
    revalidatePath(`/dashboard/appointment/${patient_id}`);
  });
