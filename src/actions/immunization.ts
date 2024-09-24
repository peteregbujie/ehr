
import { NewImmunizationSchema } from "@/lib/immunization";
import {  isProviderProcedure } from "@/lib/safe-action";
import { createImmunizationUseCase } from "@/use-cases/immunization";
import { revalidatePath } from "next/cache";



export const createImmunizationAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewImmunizationSchema   
  )
  .handler(async ({ input: {  vaccine_name, site, vaccination_date, vaccination_time, vaccinator} }) => {
    await createImmunizationUseCase({
       vaccine_name, site, vaccination_date, vaccination_time, vaccinator
    });
    revalidatePath("/provider");
  });