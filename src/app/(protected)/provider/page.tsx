import { getCurrentUser } from '@/lib/session';
import React from 'react'
import { redirect } from "next/navigation";

export default async function Provider() {
    const user = await getCurrentUser();

    if (!user || user.role !== "provider") redirect("/login");
    return (
        <div>Provider</div>
    )
}

