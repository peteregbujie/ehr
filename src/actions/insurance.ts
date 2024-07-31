
import {  isAdminProcedure } from "@/lib/safe-action";
import { NewInsuranceSchema } from "@/lib/validations/insurance";
import { CreateInsuranceUseCase } from "@/use-cases/insurance";

import { revalidatePath } from "next/cache";



export const createInsuranceAction = isAdminProcedure
  .createServerAction()
  .input(    
    NewInsuranceSchema   
  )
  .handler(async ({ input: { phone_number, insurance_provider, policy_number, group_number } }) => {
    await CreateInsuranceUseCase({
      phone_number, insurance_provider, policy_number, group_number
    });
    revalidatePath("/dashboard/admin");
  });