import { NewImmunizationSchema } from "@/lib/immunization";
import {  isProviderProcedure } from "@/lib/safe-action";
import { createImmunizationUseCase } from "@/use-cases/immunization";
import { revalidatePath } from "next/cache";



export const createImmunizationAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewImmunizationSchema   
  )
  .handler(async ({ input: { phone_number, vaccine_name, site, date_administered, time_administered, administrator} }) => {
    await createImmunizationUseCase({
      phone_number, vaccine_name, site, date_administered, time_administered, administrator
    });
    revalidatePath("/dashboard/provider");
  });