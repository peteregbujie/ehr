import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { AuthenticationError } from "@/use-cases/errors";

export const getCurrentUser = cache(async () => {
    const session = await auth();
    if (!session?.user) {
        return undefined;
    }
    return session.user;
});

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
};

export const getUserRole = async (role: string) => {
    const user = await assertAuthenticated();
    if (user.role !== role) {
        throw new AuthenticationError();
    }
    return user;
};