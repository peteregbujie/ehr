import { db } from "@/db";
import UserTable, {
 accountsTable,
 sessionsTable,
 verificationTokensTable,
} from "@/db/schema/user";
import { getUserRoleUseCase } from "@/use-cases/roles";
import {
 getRefreshEntryUsingTokenUseCase,
 obtainRefreshTokenTokenUseCase,
} from "@/use-cases/token";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { AuthOptions, DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const MAX_AGE_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5days

export type Role = "admin" | "doctor" | "patient";

export type User = {
 id: string;
 role: Role;
} & DefaultSession["user"];
declare module "next-auth" {
 // extend the global type
 interface Session extends DefaultSession {
  user: User; // over session with custom user type
 }
}

export async function refreshAccessToken(
 token: JWT & { exp: number; refreshToken: { token: string } }
) {
 const tokenInDb = await getRefreshEntryUsingTokenUseCase(
  token.refreshToken.token
 );

 if (!tokenInDb) {
  throw new Error("Refresh token not found");
 }

 if (new Date() > tokenInDb.expiresAt) {
  throw new Error("Refresh token expired");
 }

 const newToken = {
  ...token,
  expiresAt: new Date(Date.now() + MAX_AGE_IN_MS),
 };
 return newToken;
}

export const authConfig = {
 adapter: DrizzleAdapter(db, {
  usersTable: UserTable,
  accountsTable: accountsTable,
  sessionsTable: sessionsTable,
  verificationTokensTable: verificationTokensTable,
 } as any) as Adapter,
 session: {
  strategy: "jwt",
 },
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_ID!,
   clientSecret: process.env.GOOGLE_SECRET!,
   allowDangerousEmailAccountLinking: true,
  }),
 ],
 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    const userId = token.sub as string;
    token.role = await getUserRoleUseCase(userId);
    token.refreshToken = await obtainRefreshTokenTokenUseCase(userId);
    token.expiresAt = new Date(Date.now() + MAX_AGE_IN_MS);
   }

   const expiresAt = token.expiresAt as Date;
   DrizzleAdapter;
   if (new Date() < expiresAt) {
    return token;
   }

   return refreshAccessToken(token as any);
  },

  async session({ token, session }) {
   const userId = token.sub as string;
   session.user.id = userId;
   session.user.name = token.name;
   session.user.email = token.email;
   session.user.image = token.picture;
   session.user.role = token.role as Role;

   return session;
  },
 },
} satisfies AuthOptions;
