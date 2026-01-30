//backend
// /profile/deleteAK/deleteAK.ts
"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function deleteAccount() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
        throw new Error("Unauthorized");
    }

    const { id } = JSON.parse(userCookie);

    // Transaction，confirm delete all
    await prisma.$transaction(async (tx) => {

        // delete enrolled courses
        await tx.student_course.deleteMany({
            where: { u_id: id },
        });

        // delete user account
        await tx.user.delete({
            where: { u_id: id },
        });
    });

    // clear cookies (like logout)
    cookieStore.delete("user");
}
