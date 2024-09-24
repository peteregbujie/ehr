import db from "@/db";

import UserTable, {  insertUserSchema,  UserTypes } from "@/db/schema/user";
import {  UserRoles } from "@/lib/validations/user";
import {  SelectAppointment, SelectEncounter, SelectPatient, SelectProvider, SelectUser } from "@/types";
import { InvalidDataError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { eq, ilike, or , count} from "drizzle-orm";
import { cache } from "react";

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


export async function getUserByEmail(email: string) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.email, email),
    });

    return user;
}



export async function getUserById(userId: UserId) {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId),
    });

    return user;
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

export async function getUsers() {
    const users = await db.query.UserTable.findMany();
    return users;
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

 export const searchCurrentUser = cache(async (query: string): Promise<{user: SelectUser, patient: SelectPatient, appointments: SelectAppointment[], encounters: SelectEncounter[]}> => { 
  try {
    const user = await db.query.UserTable.findFirst({
      where: or(
        eq(UserTable.name, query),
        eq(UserTable.email, query),
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


    const encounters = user.patient.appointments.flatMap(appointment =>
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
      appointments: user.patient.appointments,
      encounters,
      
    };
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
}); 


export const getUser = cache(async (query: string, offset: number) => {
  try {
    const whereCondition = query 
      ? or(
          ilike(UserTable.name, `%${query}%`),
          ilike(UserTable.email, `%${query}%`)
        ) 
      : undefined;

    const users: SelectUser[] = await db.query.UserTable.findMany({
      where: whereCondition,
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
      limit: query ? 1000 : 5,
      offset: query ? undefined : offset,
    });

    const totalUsersResult = query ? users.length : await db.select({ count: count() }).from(UserTable);
    const totalUsers = query ? totalUsersResult : Array.isArray(totalUsersResult) ? totalUsersResult[0]?.count || 0 : 0;
    const newOffset = query ? null : (users.length >= 5 ? offset + 5 : null);

    return {
      users,
      newOffset,
      totalUsers,
    };
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
});



// get all users  
export const getAllUsers = cache(async (): Promise<{
  users: SelectUser[],
  patients: SelectPatient[],
  providers: SelectProvider[],
  appointments: SelectAppointment[]
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
        provider: true,
        admin: true,
      },
    });

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    const patients = users
      .filter(user => user.role === "patient" && user.patient)
      .map(user => user.patient) as SelectPatient[];

      const providers = users
      .filter(user => user.role === "provider" && user.provider)
      .map(user => ({ ...user.provider, appointments: [] })) as SelectProvider[];

    const appointments = users
      .flatMap(user => user.patient?.appointments ?? []) as SelectAppointment[];

    return {
      users,
      patients,
      providers,
      appointments,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});




