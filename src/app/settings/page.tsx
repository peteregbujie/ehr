import { getCurrentUser } from "@/lib/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SettingsPage from "./SettingsPage";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/api/auth/signin?callbackUrl=/settings");
    }

    return <SettingsPage user={user} />;
}
