
import {  isProviderProcedure } from "@/lib/safe-action";
import { NewVitalSignSchema } from "@/lib/validations/vitalsign";
import { createVitalSignUseCase } from "@/use-cases/vitalsign";
import { revalidatePath } from "next/cache";



export const createVitalSignAction = isProviderProcedure
  .createServerAction()
  .input(    
    NewVitalSignSchema   
  )
  .handler(async ({ input: {  height, weight, systolic_blood_pressure, diastolic_blood_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi, measured_on } }) => {
    await createVitalSignUseCase({
        height, weight, systolic_blood_pressure, diastolic_blood_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi, measured_on
        
    });
    revalidatePath("/provider");
  });