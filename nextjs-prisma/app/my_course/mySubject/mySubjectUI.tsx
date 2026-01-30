//frontend
"use client";

import { useEffect, useState } from "react";
import { getSubjectsByCourseId } from "./mySubject";
import { useSearchParams } from "next/navigation";

type Subject = {
  s_id: number;
  s_name: string;
  s_duration: number;
};

export default function MySubjectUI() {
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("courseId");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    (async () => {
      const data = await getSubjectsByCourseId(Number(courseId));
      setSubjects(data);
      setLoading(false);
    })();
  }, [courseId]);

  if (!courseId) {
    return (
      <div className="min-h-screen pt-36 flex justify-center items-start bg-linear-to-b from-slate-100 to-slate-200">
        <div className="text-slate-500 italic text-lg">No course selected</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex justify-center items-start bg-linear-to-b from-slate-100 to-slate-200">
        <div className="text-slate-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-6">
          Subjects [ Course {courseId} ]
        </h1>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-white/60 backdrop-blur-sm p-4 font-semibold text-slate-700 border-b border-slate-300">
            <span>Subject Name</span>
            <span className="text-right">Credit Hours</span>
          </div>

          {/* Table Body */}
          {subjects.length === 0 ? (
            <div className="p-4 text-center text-slate-500 italic">
              No subjects registered for this course
            </div>
          ) : (
            <ul>
              {subjects.map((s) => (
                <li
                  key={s.s_id}
                  className="grid grid-cols-2 p-4 border-b border-slate-200 last:border-b-0 hover:bg-white/30 transition"
                >
                  <span className="text-slate-800 font-medium">{s.s_name}</span>
                  <span className="text-right text-slate-500">{s.s_duration}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Back Button */}
        <div className="pt-8 flex justify-center">
          <a
            href="/my_course"
            className="px-6 py-2 rounded-lg border border-indigo-600 text-indigo-700 font-medium hover:bg-indigo-50 transition"
          >
            Back to My Courses
          </a>
        </div>

      </div>
    </div>
  );
}
