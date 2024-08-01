import { z } from "zod";

export const NewAllergySchema = z.object({
  allergen: z.string(),
  allergy_reaction: z.string(),
  severity: z.enum(["mild","moderate", "severe" ]),
  note: z.string(),
});

export type NewAllergyType = z.infer<typeof NewAllergySchema>