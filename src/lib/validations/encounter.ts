import { z } from "zod";



export const newEncounterSchema = z.object({
        date: z.string().date(),
        time: z.string().time(),
        encounter_type: z.enum(["inpatient", "outpatient", "emergency"]),
        location: z.string(),    
        assessment_and_plan: z.string(),
        chief_complaint: z.string(),
        notes: z.string(),

    })

    export type NewEncounterType = z.infer<typeof newEncounterSchema>