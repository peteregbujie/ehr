import { isAdminProcedure } from "@/lib/safe-action";
import { AppointmentSchema } from "@/lib/validations/appointment";
import { bookAppointmentUseCase } from "@/use-cases/appointment";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export const bookAppointmentAction = isAdminProcedure 
  .createServerAction()
  .input(
    AppointmentSchema
  )
  .handler(async ({ input: {  reason, patient_id, provider_id, type, status, notes, scheduled_date, timeSlotIndex, location } }) => {
    await bookAppointmentUseCase( {
        reason, patient_id, provider_id, type, status, notes, scheduled_date, timeSlotIndex, location,
    });
    revalidatePath("/dashboard/admin");
  });
