// create a provider

import {  updateUserRoleFn } from "./user";
import { AdminTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";
import { AdminTypes } from "@/db/schema/admin";
import { NotFoundError } from "@/use-cases/errors";


// create admin
export const createAdmin = async (UserId: string, adminData: AdminTypes )=>{
   
  const updatedUser = await updateUserRoleFn(UserId, "admin");

  const newAdmin = await updateAdmin(updatedUser.id, adminData );
  return  newAdmin;
}



export const updateAdmin = async (adminId: string, adminData: AdminTypes) => {

  const admin = await db.query.AdminTable.findFirst({
      where: eq(AdminTable.id, adminId)
    });

  if (!admin) {
      throw new NotFoundError();
  }   
  return await db.update(AdminTable).set(adminData).where(eq(AdminTable.id, adminId)).returning();
}


// delete admin
export const deleteAdmin = async (adminId: string) => {
  await db.delete(AdminTable).where(eq(AdminTable.id, adminId)).returning();
}

// get admin by id  
export const getAdminById = async (adminId: string) => {
  return await db.query.AdminTable.findFirst({
    where: eq(AdminTable.id, adminId)
  });
}