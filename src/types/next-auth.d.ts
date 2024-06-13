import { DefaultSession } from "next-auth";

export type Role = "admin" | "provider" | "patient";

declare module "next-auth" {
 interface Session {
  user: User & DefaultSession["user"];
 }

 interface User {
  role: Role;
  id: string;
 }
}
