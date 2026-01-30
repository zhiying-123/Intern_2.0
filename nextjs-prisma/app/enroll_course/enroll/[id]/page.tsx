
import EnrollUI from "./enrollUI";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnrollPage({ params }: PageProps) {
  const { id } = await params;
  const c_id = parseInt(id, 10);
  if (!c_id) {
    return <div className="pt-32 text-center">No course selected</div>;
  }
  const course = await prisma.course.findUnique({
    where: { c_id },
    select: {
      c_id: true,
      c_name: true,
      c_category: true,
      c_duration: true,
      c_price: true,
      c_description: true,
    },
  });
  if (!course) {
    return <div className="pt-32 text-center">Course not found</div>;
  }
  return <EnrollUI course={course} />;
}
