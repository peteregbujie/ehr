
import * as z from "zod";

export const NewInsuranceSchema = z.object({
  insurance_provider: z.string(),
  policy_number: z.string(),
  group_number: z.string(), 
});

export type NewInsuranceType = z.infer<typeof NewInsuranceSchema>