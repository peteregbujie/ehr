
import { UserRoles } from "@/lib/validations/user";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: UserRoles;
  id: string;
  email: string;
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRoles;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}