import { isAdminProcedure } from "@/lib/safe-action";
import { AppointmentSchema } from "@/lib/validations/appointment";
import { createAppointmentUseCase } from "@/use-cases/appointment";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export const createAppointmentAction = isAdminProcedure
  .createServerAction()
  .input(
    AppointmentSchema
  )
  .handler(async ({ input: {  reason, patient_id, provider_id, type, status, notes, scheduled_date, scheduled_time, location } }) => {
    await createAppointmentUseCase( {
        reason, patient_id, provider_id, type, status, notes, scheduled_date, scheduled_time, location,
    });
    revalidatePath("/dashboard/admin");
  });
