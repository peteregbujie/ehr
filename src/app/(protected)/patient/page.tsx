import { getCurrentUser } from '@/lib/session';
import React from 'react'
import { redirect } from "next/navigation";

export default async function Patient() {
    const user = await getCurrentUser();

    if (!user || user.role !== "patient") redirect("/login");
    return (
        <div>Patient</div>
    )
}

