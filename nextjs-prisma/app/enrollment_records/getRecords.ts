"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getEnrollmentRecords() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) return null;

    const { id } = JSON.parse(userCookie);

    const records = await prisma.student_course.findMany({
        where: { u_id: id },
        include: {
            course: true,
        },
        orderBy: {
            enrollment_date: 'desc'
        }
    });

    return records;
}
