
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewProcedureSchema } from "@/lib/validations/procedure";
import { createProcedureUseCase } from "@/use-cases/procedure";
import { revalidatePath } from "next/cache";



export const createProcedureAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewProcedureSchema   
  )
  .handler(async ({ input: {  name, description, status, duration, date, time, note } }) => {
    await createProcedureUseCase({
       name, description, status, duration, date, time, note 
    });
    revalidatePath("/provider");
  });