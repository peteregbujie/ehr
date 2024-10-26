
import {  authenticatedAction } from "@/lib/safe-action";
import { NewProcedureSchema } from "@/lib/validations/procedure";
import { createProcedureUseCase } from "@/use-cases/procedure";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createProcedureAction = authenticatedAction
  .createServerAction()
  .input(    
    NewProcedureSchema   
  )
  .handler(async ({ ctx, input: {  name, description, status, duration, date, time, note } }) => {
    const { path } = useServerPath();
    await createProcedureUseCase(ctx.user,{
       name, description, status, duration, date, time, note 
    });
    revalidatePath(`/patient/${path}`);
  });