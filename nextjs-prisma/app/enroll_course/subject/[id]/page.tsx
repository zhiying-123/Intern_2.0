import SubjectUI from "./subjectUI";
import { getSubjectsByCourse } from "./subject";

interface CourseID {
  params: Promise<{ id: number }>;
}

export default async function Page({ params }: CourseID) {
  const { id } = await params;

  if (!id) return <p className="pt-32 text-center">Missing course id</p>;

  const data = await getSubjectsByCourse(Number(id));

  console.log("Fetched course data:", data, "for course ID:", id);

  if (!data) return <p className="pt-32 text-center">Course not found</p>;

  return <SubjectUI courseData={data} />;
}
