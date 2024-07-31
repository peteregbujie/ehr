
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewLabSchema } from "@/lib/validations/lab";
import { createLabUseCase } from "@/use-cases/lab";
import { revalidatePath } from "next/cache";



export const createLabAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewLabSchema   
  )
  .handler(async ({ input: { phone_number, lab_name, date_ordered, lab_code, result, result_status, result_date, unit, note } }) => {
    await createLabUseCase({
      phone_number, lab_name, date_ordered, lab_code, result, result_status, result_date, unit, note
    });
    revalidatePath("/dashboard/provider");
  });