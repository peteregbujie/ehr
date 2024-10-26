
import {  authenticatedAction } from "@/lib/safe-action";
import { newEncounterSchema } from "@/lib/validations/encounter";
import { createEncounterUseCase } from "@/use-cases/encounter";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createEncounterAction = authenticatedAction
  .createServerAction()
  .input(    
    newEncounterSchema   
  )
  .handler(async ({ ctx, input: {  encounter_type, date, time, chief_complaint,location, assessment_and_plan, notes } }) => {
    const { path } = useServerPath();
    await createEncounterUseCase(ctx.user, {
        date, time, encounter_type, chief_complaint, assessment_and_plan, notes,
        location
    });
    revalidatePath(`/patient/${path}`);
  });
