import {  authenticatedAction } from "@/lib/safe-action";
import { createDiagnosisUseCase } from "@/use-cases/diagnosis";

import { revalidatePath } from "next/cache";

import { NewDiagnosisSchema } from "@/lib/validations/diagnosis";
import { useServerPath } from "@/lib/utils";


export const createDiagnosisAction = authenticatedAction
  .createServerAction()
  .input(    
    NewDiagnosisSchema
  )
  .handler(async ({ ctx, input: { diagnosis_name, diagnosis_code, date, severity, note } }) => {
    const { path } = useServerPath();
    await createDiagnosisUseCase(ctx.user,{
       diagnosis_name, diagnosis_code, date, severity, note
    });
    revalidatePath(`/patient/${path}`);
  });
