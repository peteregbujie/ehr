import { z } from "zod";

export const NewAllergySchema = z.object({
    phone_number: z.string().min(10).max(10),
  allergen: z.string(),
  allergy_reaction: z.string(),
  severity: z.enum(["mild","moderate", "severe" ]),
  note: z.string(),
});

export type NewAllergyType = z.infer<typeof NewAllergySchema>