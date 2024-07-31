
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewProcedureSchema } from "@/lib/validations/procedure";
import { createProcedureUseCase } from "@/use-cases/procedure";
import { revalidatePath } from "next/cache";



export const createProcedureAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewProcedureSchema   
  )
  .handler(async ({ input: { phone_number, name, description, status, duration, date, time, note } }) => {
    await createProcedureUseCase({
      phone_number, name, description, status, duration, date, time, note 
    });
    revalidatePath("/dashboard/provider");
  });