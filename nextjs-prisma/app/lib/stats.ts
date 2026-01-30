import prisma from "@/lib/prisma";

export type PopularCourse = {
    course: {
        c_id: number;
        c_name: string;
        c_description: string;
        c_duration: number;
        c_price: number;
        c_category: string;
    } | null;
    count: number;
};

export async function getPopularCourses(limit = 6): Promise<PopularCourse[]> {
    const groups = await prisma.student_course.groupBy({
        by: ["c_id"],
        where: { status: "APPROVED" },
        _count: { c_id: true },
        orderBy: { _count: { c_id: "desc" } },
        take: limit,
    });

    const results: PopularCourse[] = await Promise.all(
        groups.map(async (g) => {
            const course = await prisma.course.findUnique({ where: { c_id: g.c_id } });
            return {
                course: course as any,
                count: g._count.c_id,
            };
        })
    );

    return results;
}
