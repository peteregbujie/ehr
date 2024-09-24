
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewLabSchema } from "@/lib/validations/lab";
import { createLabUseCase } from "@/use-cases/lab";
import { revalidatePath } from "next/cache";



export const createLabAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewLabSchema   
  )
  .handler(async ({ input: {   test_Name, date_Ordered, test_Code, result,  result_Date,  status,  note } }) => {
    await createLabUseCase({
      test_Name, date_Ordered, test_Code, result, result_Date, note,
      status
    });
    revalidatePath("/provider");
  });