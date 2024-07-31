import { z } from "zod";

export const NewVitalSignSchema = z.object({
    phone_number: z.string().min(10).max(10),
  height: z.number().min(0),
  weight: z.number().min(0),
  systolic_blood_pressure: z.number().min(0),
  diastolic_blood_pressure: z.number().min(0),
  heart_rate: z.number().min(0),
  body_temperature: z.number().min(0),
  respiratory_rate: z.number().min(0),
  oxygen_saturation: z.number().min(0),
  bmi: z.number().min(0),
  measured_on: z.string().date(),
});

export type NewVitalSignType = z.infer<typeof NewVitalSignSchema>