"use server";
import prisma from "@/lib/prisma";

export async function getSubjectsByCourse(c_id: number) {
  const course = await prisma.course.findUnique({
    where: { c_id },
    select: {
      c_name: true,
      course_subjects: {
        select: {
          subject: {
            select: {
              s_id: true,
              s_name: true,
              s_duration: true,
              s_status: true,
            },
          },
        },
      },
    },
  });

  if (!course) return null;

  return {
    courseName: course.c_name,
    subjects: course.course_subjects.map(cs => cs.subject),
  };
}
