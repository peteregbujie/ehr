import type {
 GetServerSidePropsContext,
 NextApiRequest,
 NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import { cache } from "react";
import { authConfig } from "./auth";

export const getCurrentUser = cache(
 // look ups the cookies in the header not the database
 async (
  ...args:
   | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
   | [NextApiRequest, NextApiResponse]
   | []
 ) => {
  const session = await getServerSession(...args, authConfig);
  return { getUser: () => session?.user && { userId: session.user.id } };
 }
);
