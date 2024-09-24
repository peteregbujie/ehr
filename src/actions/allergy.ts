
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewAllergySchema } from "@/lib/validations/allergy";
import { createAllergyUseCase } from "@/use-cases/allergy";
import { revalidatePath } from "next/cache";



export const createAllergyAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewAllergySchema   
  )
  .handler(async ({ input: {  allergen , allergy_reaction, severity, note } }) => {
    await createAllergyUseCase({
       allergen, allergy_reaction, severity, note
    });
    revalidatePath("/provider");
  });