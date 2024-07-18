import { DefaultSession,  } from "next-auth";

import { UserRoles } from "@/lib/validations/user";

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRoles;
        } & DefaultSession["user"];
    }
}


