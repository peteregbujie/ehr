// create a provider

import { createUser, getUserById,  updateUserRoleFn } from "./user";
import { updateProvider } from "./provider";
import { ProviderTypes } from "@/db/schema/provider";
import { AdminTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";

// create a provider. if get user by id is not found, create user then. to create provider - update user role to provider and populate the other provider fields


// create admin
export const createAdmin = async (UserId: string, providerData: ProviderTypes )=>{
    const user = await getUserById(UserId);
    if (!user) {
        createUser(UserId);
    }
  const updatedUser = await updateUserRoleFn(UserId, "admin");

  const newAdmin = await updateProvider(updatedUser.id, providerData );
  return { newAdmin}
}


// delete admin
export const deleteAdmin = async (adminId: string) => {
  await db.delete(AdminTable).where(eq(AdminTable.id, adminId)).returning();
}

