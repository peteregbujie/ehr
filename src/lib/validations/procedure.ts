
import * as z from "zod";


export const NewProcedureSchema = z.object({
  phone_number: z.string().min(10).max(10),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  date: z.string().date(),
  time: z.string().time(),
  status: z.enum(["completed", "incomplete", "cancelled" ]),
  note: z.string(),
});

export type NewProcedureType = z.infer<typeof NewProcedureSchema>