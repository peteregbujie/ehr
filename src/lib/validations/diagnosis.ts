import { z } from 'zod';

export const NewDiagnosisSchema = z.object({
  diagnosis_name: z.string(),
  date: z.string().date(),
  diagnosis_code: z.string(),
  severity: z.enum(["mild","moderate", "severe" ]),
  note: z.string(),
});

export type NewDiagnosisType = z.infer<typeof NewDiagnosisSchema>