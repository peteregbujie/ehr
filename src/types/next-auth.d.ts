import { DefaultSession,  } from "next-auth";

import { UserRoles } from "@/lib/validations/user";

declare module "next-auth" {
    interface Session {
      user: User & DefaultSession["user"];
    }
  
    interface User {
      role: UserRoles 
    }
  }

