import db from "@/db";
import UserTable from "@/db/schema/user";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

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