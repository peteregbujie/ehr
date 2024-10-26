
import { authenticatedAction } from "@/lib/safe-action";
import { useServerPath } from "@/lib/utils";
import { AppointmentSchema } from "@/lib/validations/appointment";
import { bookAppointmentUseCase } from "@/use-cases/appointment";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export const bookAppointmentAction = authenticatedAction 
  .createServerAction()
  .input(
    AppointmentSchema
  )
  .handler(async ({ ctx,input: {  reason,  provider_id, type, status, notes, scheduled_date, timeSlotIndex, location, patient_id } }) => {
    const { path } = useServerPath();
    await bookAppointmentUseCase( ctx.user, {
        reason, provider_id, type, status, notes, scheduled_date, timeSlotIndex, location, patient_id
    });
    revalidatePath(`/patient/${path}`);
  });
