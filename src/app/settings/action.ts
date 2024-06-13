"use server";
import { auth } from "@/auth";
import db from "@/db";
import UserTable from "@/db/schema/user";

import { UpdateProfileValues, updateProfileSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";



export  async function updateProfile(values: UpdateProfileValues) {
 const session = await auth();
 const userId = session?.user?.id;

 if (!userId) {
  throw Error("Unauthorized");
 }

 const { name } = updateProfileSchema.parse(values);

 await db.update(UserTable).set({ name }).where(eq(UserTable.id, userId));
  

 revalidatePath("/");
}
