"use client";

interface Subject {
  s_id: number;
  s_name: string;
  s_duration: number;
  s_status: string;
}

interface CourseSubject {
  courseName: string;
  subjects: Subject[];
}

export default function SubjectUI({ courseData }: { courseData: CourseSubject }) {
  console.log("SubjectUI received data:", courseData);
  return (
    <div className="pt-36 px-6 min-h-screen bg-gray-100 flex items-start justify-center pb-20">
      <div className="w-full max-w-2xl">
        {/* ===== Receipt Header ===== */}
        <div className="bg-white rounded-t-2xl shadow-lg p-8 text-center border-b-2 border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900">{courseData.courseName}</h1>
          <p className="text-gray-500 mt-2 text-sm">Course Subjects</p>
        </div>

        {/* ===== Receipt Body ===== */}
        <div className="bg-white shadow-lg px-8 py-6">
          {courseData.subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No subjects found for this course</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseData.subjects.map((sub, index) => (
                <div key={sub.s_id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sub.s_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Credit Hours: {sub.s_duration}</p>
                    </div>
                    {/* status intentionally hidden per design */}
                  </div>
                  {index < courseData.subjects.length - 1 && (
                    <div className="border-b border-gray-200 mt-4"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Receipt Footer ===== */}
        <div className="bg-white rounded-b-2xl shadow-lg px-8 py-4 text-center border-t-2 border-gray-200">
          <p className="text-gray-600 text-sm">Total Subjects: {courseData.subjects.length}</p>
          <p className="text-gray-600 text-sm">Total Credit Hours: {courseData.subjects.reduce((sum, s) => sum + (s.s_duration || 0), 0)}</p>
        </div>
      </div>
    </div>
  );
}
