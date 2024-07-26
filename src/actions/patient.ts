import { isAdminProcedure } from "@/lib/safe-action"
import { createPatientUseCase } from "@/use-cases/patient";
import { revalidatePath } from "next/cache";
import { z } from "zod"


export const createPatientAction = isAdminProcedure
    .createServerAction()
    .input(
        z.object({         
    full_name: z.string().min(3).max(32),
    email: z.string().email(),
    gender: z.enum(["male", "female"]),
    date_of_birth: z.string().date(),
    phone_number: z.string().min(10).max(10), 
    address: z.string(),
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
        })
      )
      .handler(async ({ input:         {      
        full_name,
        email,
        gender,
        date_of_birth,
        phone_number,
        address,
        height,
        weight,
        occupation,
        marital_status,
        emergency_contact_name,
        emergency_contact_relationship,
        emergency_contact_number,
        socialHistory,
        past_medical_history,
        family_medical_history,
        blood_type,
        primary_care_physician,
        preferred_language, note }
       }) => {
        await createPatientUseCase( {
          full_name,
          email,
          gender,
          date_of_birth,
          phone_number,
          address,
          height,
          weight,
          occupation,
          marital_status,
          emergency_contact_name,
          emergency_contact_relationship,
          emergency_contact_number,
          socialHistory,
          past_medical_history,
          family_medical_history,
          blood_type,
          primary_care_physician,
          preferred_language,
          note
        });
        revalidatePath(`/dashboard/patients`);
      });