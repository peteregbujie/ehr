
import {  isProviderProcedure } from "@/lib/safe-action";
import { extendedMedicationSchema } from "@/lib/validations/medication";
import { createMedicationUseCase } from "@/use-cases/medication";
import { revalidatePath } from "next/cache";



export const createMedicationAction = isProviderProcedure
  .createServerAction()
  .input(    
    extendedMedicationSchema   
  )
  .handler(async ({ input: { phone_number, medication_name, code, dosage, frequency, route, status, note, start_date, end_date} }) => {
    await createMedicationUseCase({
      phone_number, medication_name, code, dosage, frequency, route, status, note, start_date, end_date
    });
    revalidatePath("/dashboard/provider");
  });
