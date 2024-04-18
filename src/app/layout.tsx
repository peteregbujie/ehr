import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ContextProvider } from "./context-provider";
import "./globals.css";

export const metadata: Metadata = {
 title: "EHR",
 description: "Electronic Health Record",
};

const fontSans = FontSans({
 subsets: ["latin"],
 variable: "--font-sans",
});

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <html lang="en" suppressHydrationWarning>
   <head />
   <body
    className={cn(
     "min-h-screen bg-background font-sans antialiased",
     fontSans.variable
    )}
   >
    <ContextProvider>{children}</ContextProvider>
   </body>
  </html>
 );
}
