//backend
"use server";

import prisma from "@/lib/prisma";

export async function getSubjectsByCourseId(courseId: number) {
  const course = await prisma.course.findUnique({
    where: { c_id: courseId },
    include: {
      course_subjects: {
        include: { subject: true },
      },
    },
  });

  if (!course) return [];

  return course.course_subjects.map(cs => cs.subject);
}
