import { UserId } from "@/use-cases/types";
import { AuthenticationError, EmailInUseError } from "./errors";
import { createUser, deleteUser, getUserByEmail, getUserById, getUsers, updateUser } from "@/data-access/user";


export async function deleteUserUseCase(

    userToDeleteId: UserId,
) {


    await deleteUser(userToDeleteId);
}


export async function getUsersUseCase() {
    const users = await getUsers();
    return users;
}


export async function getUserUseCase(userId: UserId) {
    const user = await getUserById(userId);
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
}


export async function updateUserUseCase(

    userToUpdateId: UserId,
    data: unknown,
) {

    await updateUser(userToUpdateId, data);
}


export async function getUserByEmailUseCase(email: string) {
    const user = await getUserByEmail(email);

    return user;
}

export async function createUserUseCase(
    data: any
) {
    let existingUser = await getUserByEmail(data.email);

    if (!existingUser) {
        let newUser = await createUser(data);
        return newUser;
    }
    throw new EmailInUseError();
}