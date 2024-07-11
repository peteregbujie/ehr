
import NavBar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Electronic Health Record",
    absolute: "EHR",
  },
  description:
    "Electronic Health Record",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NavBar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}