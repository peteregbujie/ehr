

import db from "@/db";
import { AdminTypes } from "@/db/schema/admin";
import { AppointmentTypes } from "@/db/schema/appointment";
import { EncounterTypes } from "@/db/schema/encounter";
import { PatientTypes } from "@/db/schema/patient";
import { ProviderTypes } from "@/db/schema/provider";

import UserTable, {  insertUserSchema,  UserTypes } from "@/db/schema/user";
import {  UserRoles } from "@/lib/validations/user";
import {  SelectAppointment, SelectEncounter, SelectPatient, SelectProvider, SelectUser } from "@/types";
import { InvalidDataError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { eq, ilike, or , count} from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";






export type UserWithRelations = UserTypes & {
  patient?: PatientTypes & {
    appointments?: (AppointmentTypes & {
      encounter?: EncounterTypes[];
    })[];
  };
  provider?: ProviderTypes & {
    appointments?: (AppointmentTypes & {
      encounter?: EncounterTypes[];
    })[];
  };
  admin?: AdminTypes;
 };
 
 interface UserWithRelationsResult {
  result: UserWithRelations[];
  newOffset: number | null;
  totalUsers: number;
}



type UserData = UserTypes & {
  patient?: PatientTypes & {
    appointments?: (AppointmentTypes & {
      encounter?: EncounterTypes[];
    })[];
  };  
 };

export type userUpdateType =  Pick<UserTypes,  "email">


export type FormData = {
    role: UserRoles;
  };

  type SanitizedinsertUserSchema = Pick<UserTypes, "email"| "name"| "date_of_birth"| "gender">

export async function createUser(data: SanitizedinsertUserSchema, trx = db) {
    // Parse the input data against the schema
    const parsedData = insertUserSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertUserDataType
  const newUser = await trx.insert(UserTable).values(parsedData.data).returning();

  return newUser;
  
}



export async function updateUser(userId: UserId, data: userUpdateType) {
    // Parse the input data against the schema
    const parsedData = insertUserSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertUserDataType
    await db.update(UserTable).set(parsedData.data).where(eq(UserTable.id, userId)).returning();
}

export async function deleteUser(userId: UserId) {
    await db.delete(UserTable).where(eq(UserTable.id, userId));
}



// change user role
export async function updateUserRoleFn(userId: UserId, role: UserRoles) {
   
    const updatedUser = await db.update(UserTable).set({ role}).where(eq(UserTable.id, userId)).returning();
   
    return updatedUser[0]
    
}   

//update user name
export async function updateUserNameFn(userId: UserId, name: string) {
    await db.update(UserTable).set({ name}).where(eq(UserTable.id, userId)).returning();

    
}

// get patient by email. look up the user by email then get the patient
export async function getPatientIdByEmail(email: string) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
        with: {
            patient: true
        }
    })
    return user?.patient
}


// get user by email
export async function getUserByEmail(email: string) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
    })
    return user
}
 export const searchUser = cache(async (query: string): Promise<{user: SelectUser, patient: SelectPatient, appointments: SelectAppointment[], encounters: SelectEncounter[]}> => { 
  try {
    const user = await db.query.UserTable.findFirst({
      where: or(
        ilike(UserTable.name, `%${query}%`),
        ilike(UserTable.email, `%${query}%`),
        eq(UserTable.id, query),

      ),      
      
      orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
      with: {
        patient: {
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


    const encounters = user.patient?.appointments.flatMap(appointment =>
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
      patient: user.patient,
      appointments: user.patient?.appointments,
      encounters,
      
    };
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
}); 



// Get All User
export const getUsers =  unstable_cache(async (): Promise<{
  users: SelectUser[],
  patients: SelectPatient[],
  appointments: SelectAppointment[],
  encounters: SelectEncounter[],
  totalUsers: number,
  newOffset: number | null
}> => { 
  try {
    const users = await db.query.UserTable.findMany({
      orderBy: (users, { asc }) => [asc(users.created_at)],
      with: {
        patient: {
          with: {
            appointments: {
            orderBy: (appointments, { asc }) => [asc(appointments.scheduled_date)],
              with: {
                encounter: {
                 orderBy: (encounters, { asc }) => [asc(encounters.date)], 
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
      limit: 10,
      offset: 0,
    });

    const totalUsersResult =  await db.select({ count: count() }).from(UserTable);
    const totalUsers =  Array.isArray(totalUsersResult) ? totalUsersResult[0]?.count || 0 : 0;
    const newOffset =  (users.length >= 5 ? 0 + 5 : null);

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    const patients = users.map(user => user.patient);

    const appointments = users
      .flatMap(user => user.patient?.appointments ?? []) ;

    return {
      users,
      patients,    
      appointments,
      encounters: appointments.flatMap(appointment =>
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
      ),

      totalUsers,
      newOffset

    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});





// Get Searched User

export const getUserById = async (userId: string): Promise<UserData> => {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
    with: {
      patient: {
        with: {
          appointments: {
            with: {
              encounter: {
                with: {
                  vitalSigns: true,
                  insurance: true,
                  diagnoses: true,
                  procedures: true,
                  medications: true,
                  allergies: true,
                  labs: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User not found with ID ${userId}`);
  }

  return user;
};