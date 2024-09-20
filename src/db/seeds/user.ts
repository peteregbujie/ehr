
import type { DbType } from "@/db";

import users from "@/db/seeds/data/user.json";
import { UserTable } from "@/db/schema";


// write a function that maps over users and inserts them into the database



export default async function seed( db:  DbType) {
 for (const user of users) {
 /*   const validatedRole = user.role === "patient" || user.role === "admin" || user.role === "provider"
     ? user.role
     : "patient"; // Default to "patient" if the role is invalid */

     await db.insert(UserTable)
     .values({
       ...user,       
       role: user.role as "patient" | "admin" | "provider",
       date_of_birth: user.date_of_birth,
       emailVerified: user.emailVerified ,
       created_at: user.created_at,
       updated_at: user.updated_at,
       gender: user.gender as "male" | "female"
     }).returning();
 }
}


