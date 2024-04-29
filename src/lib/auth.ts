import { db } from "@/db";
import { UsersTable as users } from "@/db/schema/users";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import type {
 GetServerSidePropsContext,
 NextApiRequest,
 NextApiResponse,
} from "next";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { unstable_noStore } from "next/cache";

declare module "next-auth" {
 interface Session extends DefaultSession {
  user: {
   id: string;
  } & DefaultSession["user"];
 }
}

export const authConfig = {
 adapter: DrizzleAdapter(db) as any,
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
   const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, token.email || ""))
    .limit(1);

   if (!dbUser) {
    token.id = user.id.toString();
    return token;
   }

   return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.image,
   };
  },
  async session({ token, session }) {
   if (token) {
    session.user.id = token.id as string;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = token.picture;
   }

   return session;
  },
 },
} satisfies AuthOptions;

// Use it in server contexts
export async function auth(
 ...args:
  | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
  | [NextApiRequest, NextApiResponse]
  | []
) {
 unstable_noStore();
 const session = await getServerSession(...args, authConfig);
 return { getUser: () => session?.user && { userId: session.user.id } };
}
