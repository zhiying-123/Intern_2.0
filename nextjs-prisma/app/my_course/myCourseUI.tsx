//frontend
"use client";

import Link from "next/link";

type CourseItem = {
    course: {
        c_id: number;
        c_name: string;
        c_description: string;
        c_duration: number; // credit hours
        c_price: number;
        c_category: string;
        course_subjects: {
            subject: {
                s_id: number;
                s_name: string;
                s_duration: number;
            };
        }[];
    };
};

export default function MyCourseUI({ courses }: { courses: CourseItem[] }) {
    const grouped = {
        Diploma: courses.filter(c => c.course.c_category === "DIPLOMA"),
        Degree: courses.filter(c => c.course.c_category === "DEGREE"),
        Master: courses.filter(c => c.course.c_category === "MASTER"),
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 pt-36 px-6 pb-24">
            <div className="max-w-6xl mx-auto space-y-16">
                {Object.entries(grouped).map(([category, items]) => (
                    <CategorySection key={category} title={category} items={items} />
                ))}
            </div>
        </div>
    );
}

//=========================
// Category Section
//=========================
function CategorySection({
    title,
    items,
}: {
    title: string;
    items: CourseItem[];
}) {
    return (
        <section className="flex justify-center">
            <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    {title}
                </h2>

                {items.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500 italic">
                        No courses enrolled for this level
                    </div>
                ) : (
                    <div className="space-y-6">
                        {items.map(item => (
                            <CourseCard key={item.course.c_id} course={item.course} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

//=========================
// Course Card
//=========================
function CourseCard({ course }: { course: CourseItem["course"] }) {
    return (
        <div className="w-full max-w-5xl mx-auto border-l-4 border-slate-400 px-6 py-4 space-y-3
                    bg-white/80 backdrop-blur-md rounded-xl shadow-md">

            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800">{course.c_name}</h3>
                <p className="text-xs text-slate-500">
                    {course.c_category} · {course.c_duration} credit hours · RM {course.c_price}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed wrap-break-words max-w-full">
                {course.c_description}
            </p>

            {/* View Subjects Button */}
            <div className="pt-2">
                <Link
                    href={`/my_course/mySubject?courseId=${course.c_id}`}
                    className="w-full py-2.5 rounded-lg border border-indigo-600 text-indigo-700 font-medium hover:bg-indigo-50 transition inline-block text-center"
                >
                    View registered subjects
                </Link>
            </div>
        </div>
    );
}
