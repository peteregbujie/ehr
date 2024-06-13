import db from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type Session, type User } from "next-auth";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, 
  //@ts-ignore
  adapter: DrizzleAdapter(db) as Adapter,
 
providers: [Google],
 callbacks: {
  async session({ session, user }: { session: Session; user?: User } ) {
     if (user && session?.user) {
       session.user.id = user.id;
       session.user.role = user.role;
      }
     
   return session;
   },
   
 },
});
