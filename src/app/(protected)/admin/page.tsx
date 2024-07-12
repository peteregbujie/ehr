import { getCurrentUser } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin",
};

export default async function Page() {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") redirect("/login");



    return (
        <main className="mx-auto my-10 space-y-3">
            <h1 className="text-center text-xl font-bold">Admin Page</h1>
            <p className="text-center">Welcome, admin!</p>
        </main>
    );
}
