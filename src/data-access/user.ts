import db from "@/db";
import UserTable, { insertUserSchema } from "@/db/schema/user";
import { InvalidDataError } from "@/use-cases/errors";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";



export async function createUser(data: unknown, trx = db) {
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



export async function updateUser(userId: UserId, data: unknown) {
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
