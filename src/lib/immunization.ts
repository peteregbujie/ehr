import { z } from 'zod';

export const NewImmunizationSchema = z.object({
  vaccine_name: z.string(),
  site: z.string(),
  vaccination_date: z.string().date(),
  vaccination_time: z.string().time(),  
  vaccinator: z.string(),
});

export type NewImmunizationType = z.infer<typeof NewImmunizationSchema>