"use server";

import prisma from "@/lib/prisma";

export interface CourseFilter {
  name?: string;
  category?: string;
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  priceSort?: "asc" | "desc";
}

export async function getCourses(filter: CourseFilter = {}) {
  const { name, category, minDuration, maxDuration, minPrice, maxPrice, priceSort } = filter;

  return prisma.course.findMany({
    where: {
      c_name: { contains: name ?? undefined },
      c_category: category ? category : undefined,
      c_duration: {
        gte: minDuration ?? undefined,
        lte: maxDuration ?? undefined,
      },
      c_price: {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined,
      },
      c_status: "AVAILABLE",
    },
    orderBy: priceSort ? { c_price: priceSort } : undefined,
    include: {
      course_subjects: {
        include: { subject: true },
      },
    },
  });
}
