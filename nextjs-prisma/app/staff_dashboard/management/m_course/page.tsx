// Course Management Page
import { getAllCourses, getAllSubjects } from "./m_course";
import CourseManagementUI from "./m_courseUI";

export default async function CourseManagementPage() {
    const coursesResult = await getAllCourses();
    const subjectsResult = await getAllSubjects();

    if (!coursesResult.success || !subjectsResult.success) {
        return (
            <div className="bg-red-50 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-red-900 font-bold text-xl">Error loading data</p>
            </div>
        );
    }

    return (
        <div>
            {/* Stats banner removed per design preference (light, minimal) */}

            <CourseManagementUI
                courses={coursesResult.data || []}
                availableSubjects={subjectsResult.data || []}
            />
        </div>
    );
}
