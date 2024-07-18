// update provider
import db from "@/db";
import ProviderTable, { ProviderTypes } from "@/db/schema/provider";
import {  NotFoundError } from "@/use-cases/errors";
import { ProviderId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import { createUser, getUserById, updateUserRole } from "./user";



export const createProvider = async (UserId: string, providerData: ProviderTypes )=>{
    const user = await getUserById(UserId);
    if (!user) {
        createUser(UserId);
    }
  const updatedUser = await updateUserRole(UserId, "provider");

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