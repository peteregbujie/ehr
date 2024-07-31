import db from "@/db";
import { PatientTypes } from "@/db/schema/patient";
import UserTable, {  insertUserSchema, UserTypes } from "@/db/schema/user";
import { NewPatientType } from "@/lib/validations/patient";
import {  UserRoles } from "@/lib/validations/user";

import { InvalidDataError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { eq, or } from "drizzle-orm";
import { cache } from "react";



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
  await trx.insert(UserTable).values(parsedData.data).returning();

  
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

type userUpdateType =  Pick<UserTypes,  "email">

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

export const searchUser = cache(async (query: string) => {
  try {
    const user = await db.query.UserTable.findFirst({
      where: or(
        eq(UserTable.name, query),
        eq(UserTable.email, query),
      ),
      orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
      with: {
        patients: {
          with: {
            appointments: {
              orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
              with: {
                encounter: {
                  orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
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

    // Destructure the first patient from the user object
    const { patients } = user;
    const OnlyPatient = patients;

    // Map appointments from the first patient
    const appointments = OnlyPatient.appointments.map(appointment => ({
      ...appointment,
      encounter: appointment.encounter, // Directly assign encounter without mapping if it's a single object
    }));

    // Return the modified user object with mapped appointments
    return {
      ...user,
      patients: [
        {
          ...OnlyPatient,
          appointments,
        },
      ],
    };
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
});