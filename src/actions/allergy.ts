
import {  authenticatedAction } from "@/lib/safe-action";
import { useServerPath } from "@/lib/utils";
import { NewAllergySchema } from "@/lib/validations/allergy";
import { createAllergyUseCase } from "@/use-cases/allergy";
import { revalidatePath } from "next/cache";



export const createAllergyAction = authenticatedAction
  .createServerAction()
  .input(    
    NewAllergySchema   
  )
  .handler(async ({ ctx, input: {  allergen , allergy_reaction, severity, note } }) => {
    const { path } = useServerPath();
    await createAllergyUseCase(ctx.user,{
       allergen, allergy_reaction, severity, note
    });
    revalidatePath(`/patient/${path}`);
  });