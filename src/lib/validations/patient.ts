
import * as z from "zod";


const NewPatientType = z.object({
    full_name: z.string().min(3).max(32),
    email: z.string().email(),
    gender: z.enum(["male", "female"]),
    date_of_birth: z.string().date(),
    address: z.string(),
    phone_number: z.string().min(10).max(10), 
    height: z.string(),
    weight: z.string(),
    occupation: z.string(),
    marital_status: z.enum(["Married", "Single", "Divorced","Widowed" ]),
    emergency_contact_name: z.string(),
    emergency_contact_relationship: z.string(),
    emergency_contact_number: z.string(),
    socialHistory: z.string(),
    past_medical_history: z.string(),
    family_medical_history: z.string(),
    blood_type: z.enum(["A positive",
      "A negative",
      "B positive",
      "B negative",
      "AB positive",
      "AB negative",
      "O positive",
      "O negative",]),
      primary_care_physician: z.string(),
      preferred_language: z.enum(["English", "Spanish", "Vietnamese", "Mandarin", "Portuguese"]),
      note: z.string(),

  });

  export type NewPatientType = z.infer<typeof NewPatientType>;