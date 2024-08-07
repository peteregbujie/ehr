// update provider
import db from "@/db";
import ProviderTable, { ProviderTypes } from "@/db/schema/provider";
import {  NotFoundError } from "@/use-cases/errors";
import { ProviderId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import { createUser, getUserById, updateUserRoleFn } from "./user";
import UserTable from "@/db/schema/user";



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
