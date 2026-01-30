//backend
// /my_course/myCourse.ts
"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getMyCourses() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) return null;

    const { id } = JSON.parse(userCookie);

    const courses = await prisma.student_course.findMany({
        where: { 
            u_id: id,
            status: "APPROVED"
        },
        include: {
            course: {
                include: {
                    course_subjects: {
                        include: { subject: true },
                    },
                },
            },
        },
    });

    return courses;
}
