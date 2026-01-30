import CourseListUI from "./courseListUI";
import { getCourses } from "./getCourse";

export default async function Page() {
  const courses = await getCourses();
  return <CourseListUI courses={courses} />;
}
