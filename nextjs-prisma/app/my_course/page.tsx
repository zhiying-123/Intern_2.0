// /my_course/page.tsx
import { redirect } from "next/navigation";
import MyCourseUI from "./myCourseUI";
import { getMyCourses } from "./myCourse";

export default async function MyCoursePage() {
    const courses = await getMyCourses();

    if (!courses) {
        redirect("/login");
    }

    return <MyCourseUI courses={courses} />;
}
