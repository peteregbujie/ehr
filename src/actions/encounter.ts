
import {  isProviderProcedure } from "@/lib/safe-action";
import { newEncounterSchema } from "@/lib/validations/encounter";
import { createEncounterUseCase } from "@/use-cases/encounter";
import { revalidatePath } from "next/cache";



export const createEncounterAction = isProviderProcedure
  .createServerAction()
  .input(    
    newEncounterSchema   
  )
  .handler(async ({ input: {  encounter_type, date, time, chief_complaint,location, assessment_and_plan, notes } }) => {
    await createEncounterUseCase({
        date, time, encounter_type, chief_complaint, assessment_and_plan, notes,
        phone_number,
        location
    });
    revalidatePath("/dashboard/provider");
  });
