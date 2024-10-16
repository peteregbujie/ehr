// update provider
import db from "@/db";
import ProviderTable, { ProviderTypes } from "@/db/schema/provider";
import {  NotFoundError } from "@/use-cases/errors";
import { ProviderId } from "@/use-cases/types";
import { eq, ilike } from "drizzle-orm";
import {  getUserById, updateUserRoleFn } from "./user";
import UserTable, { UserTypes } from "@/db/schema/user";
import { cache } from "react";
import { SelectAppointment, SelectEncounter, SelectProvider, SelectUser} from "@/types";
import { AppointmentTypes } from "@/db/schema/appointment";
import { EncounterTypes } from "@/db/schema/encounter";



export const createProvider = async (UserId: string, providerData: ProviderTypes )=>{
  
  const updatedUser = await updateUserRoleFn(UserId, "provider");

 const newProvider = await updateProvider(updatedUser.id, providerData );
  return { newProvider}
}




export const updateProvider = async (providerId: ProviderId, providerData: ProviderTypes) => {

    const provider = await db.query.ProviderTable.findFirst({
        where: eq(ProviderTable.id, providerId)
      });

    if (!provider) {
        throw new NotFoundError();
    }   
    return await db.update(ProviderTable).set(providerData).where(eq(ProviderTable.id, providerId)).returning();
}

// delete provider
export const deleteProvider = async (providerId: string) => {
    await db.delete(ProviderTable).where(eq(ProviderTable.id, providerId)).returning();
}


// get all providers
export const getAllProviders = async () => {
    const providers = await db.query.UserTable.findMany({
        where: eq(UserTable.role, "provider"),
        columns: {
            id: true,
            name: true,
        }
      });
      const providersDetails = [];

      for (const provider of providers) {
        const details = await db.query.ProviderTable.findMany({
            where: eq(ProviderTable.user_id, provider.id),
        });
        providersDetails.push({ id: details[0].id, name: provider.name,  });
    }

    return providersDetails;
};


// get provider name from usertable given appointment.provider_id
export const getProviderNameandSpeciality = async (providerId: string) => {
    try {
        const provider = await getProviderUserId(providerId);
        const user = await getUserById(provider.user_id);
        return {name: user?.name, specialty: provider.specialty};
    } catch (error) {
        console.error(error);

        throw new Error("Failed to get provider name");
    }
};


// find the user_id field from the provider table with this provider_id then use the user_id to find the user name from userTable
export const getProviderUserId = async (providerId: string) => {
    const result = await db.query.ProviderTable.findFirst({
        where: eq(ProviderTable.id, providerId),
        columns: {
            user_id: true,
            specialty: true
        }
    });
    if (!result || !result.user_id) {
        throw new Error("Provider user ID not found");
    }
    return result;
};




// get provider by id and return all their appointments and encounters
export const getProviderAppointnmentsandEncounters = cache(async (providerId: string): Promise<{ provider: ProviderTypes, appointments: SelectAppointment[], encounters: SelectEncounter[]}> => {
    try {
    const provider = await db.query.ProviderTable.findFirst({
        where: eq(ProviderTable.id, providerId),
        with: {
            appointments: {
                orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
                with: {
                  encounter: {
                    orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
                    with: {
                      medications: true,
                      vitalSigns: true,
                      diagnoses: true,
                      allergies: true,
                      procedures: true,
                      labs: true,
                      immunizations: true,
                      insurance: true,
                    },
                  },
                },
              },
        }
    });
    if (!provider ) {
        throw new Error("User not found");
      }
  
  
      const encounters =provider.appointments.flatMap(appointment =>
        appointment.encounter.map(encounter => ({
          ...encounter,
          medications: encounter.medications,
          vitalSigns: encounter.vitalSigns,
          diagnoses: encounter.diagnoses,
          allergies: encounter.allergies,
          procedures: encounter.procedures,
          labs: encounter.labs,
          immunizations: encounter.immunizations,
          insurance: encounter.insurance,
        }))
      );
  
     
      return {        
        provider: {
            id: provider.id,
            user_id: provider.user_id,
            specialty: provider.specialty,
            license_number: provider.license_number,
            provider_qualification: provider.provider_qualification,
            
        },
        appointments: provider.appointments,
            encounters      
      };
    } catch (error) {
      console.error("Cant Find Provider:", error);
      throw error;
    }
}); 


  
export async function getProviderWithName(providerId: string) {
  return db.select({
    providerId: ProviderTable.id,
    name: UserTable.name,  
    date_of_birth: UserTable.date_of_birth      
  })
  .from(ProviderTable)
  .innerJoin(UserTable, eq(ProviderTable.user_id, UserTable.id))
  .where(eq(ProviderTable.id, providerId))
  .execute();
}


export async function getProviderIdByUserId(userId: string) {

  try {
    const provider = await db.query.ProviderTable.findFirst({
      where: eq(ProviderTable.user_id, userId),
      columns: {
        id: true,
      },
    });

   if (!provider) {
      throw new Error(`Provider not found for user ID: ${userId}`);
    } 

    return provider;

  } catch (error) {
    console.error('Error fetching provider ID:', error);
    throw error;
  }
}




export const getProviderData = cache(async (query: string): Promise<{user: SelectUser, provider: SelectProvider, appointments: SelectAppointment[], encounters: SelectEncounter[]}> => { 
  try {
    const user = await db.query.UserTable.findFirst({
      where: 
        eq(UserTable.id, query),
      
      
      orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
      with: {
        provider: {
          with: {
            appointments: {
              orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
              with: {
                encounter: {
                  orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
                  with: {
                    medications: true,
                    vitalSigns: true,
                    diagnoses: true,
                    allergies: true,
                    procedures: true,
                    labs: true,
                    immunizations: true,
                    insurance: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user ) {
      throw new Error("User not found");
    }


    const encounters = user.provider?.appointments.flatMap(appointment =>
      appointment.encounter.map(encounter => ({
        ...encounter,
        medications: encounter.medications,
        vitalSigns: encounter.vitalSigns,
        diagnoses: encounter.diagnoses,
        allergies: encounter.allergies,
        procedures: encounter.procedures,
        labs: encounter.labs,
        immunizations: encounter.immunizations,
        insurance: encounter.insurance,
      }))
    );

   
    return {
      user,
      provider: user.provider,
      appointments: user.provider?.appointments,
      encounters,
      
    };
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
}); 