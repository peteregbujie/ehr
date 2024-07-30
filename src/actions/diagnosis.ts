
import {  isProviderProcedure } from "@/lib/safe-action";
import { createDiagnosisUseCase } from "@/use-cases/diagnosis";

import { revalidatePath } from "next/cache";

import { NewDiagnosisSchema } from "@/lib/validations/diagnosis";

export const createDiagnosisAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewDiagnosisSchema
  )
  .handler(async ({ input: { phone_number,diagnosis_name, diagnosis_code, date, severity, note } }) => {
    await createDiagnosisUseCase({
      phone_number, diagnosis_name, diagnosis_code, date, severity, note
    });
    revalidatePath("/dashboard/provider");
  });
