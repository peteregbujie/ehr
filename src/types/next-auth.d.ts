import { DefaultSession } from "next-auth";

import { userRoles } from "@/db/schema/user";

declare module "next-auth" {
    interface Session {
        user: {
            role: userRoles;
        } & DefaultSession["user"];
    }
}