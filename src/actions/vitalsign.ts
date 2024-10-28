
import {  authenticatedAction } from "@/lib/safe-action";
import { selectVitalSignSchema } from "@/lib/validations/vitalsign";
import { createVitalSignUseCase } from "@/use-cases/vitalsign";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createVitalSignAction = authenticatedAction
  .createServerAction()
  .input(    
    selectVitalSignSchema   
  )
  .handler(async ({ ctx, input: {  height, weight, systolic_blood_pressure, diastolic_blood_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi, measured_on } }) => {
    const { path } = await useServerPath();
    await createVitalSignUseCase(ctx.user,{
        height, weight, systolic_blood_pressure, diastolic_blood_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi, measured_on
        
    });
    revalidatePath(`/patient/${path}`);
  });