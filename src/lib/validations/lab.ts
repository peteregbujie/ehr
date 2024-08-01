
// create a zod schema for lab from the lab table

import * as z from "zod";

export const NewLabSchema = z.object({
    
  lab_name: z.string(),
  date_ordered: z.string().date(),
  lab_code: z.string(),
  result: z.string(),
  status: z.enum(["pending", "completed", "cancelled" ]),
  result_date: z.string().date(),
  unit: z.string(),
  note: z.string(),
})

export type NewLabType = z.infer<typeof NewLabSchema>