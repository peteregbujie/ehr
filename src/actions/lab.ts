
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewLabSchema } from "@/lib/validations/lab";
import { createLabUseCase } from "@/use-cases/lab";
import { revalidatePath } from "next/cache";



export const createLabAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewLabSchema   
  )
  .handler(async ({ input: {  lab_name, date_ordered, lab_code, result,  result_date, unit, status,  note } }) => {
    await createLabUseCase({
       lab_name, date_ordered, lab_code, result, result_date, unit, note,
      status
    });
    revalidatePath("/dashboard/provider");
  });