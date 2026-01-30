"use client";
import { useState } from "react";
import { enrollCourse } from "./enrollCourse";

interface Course {
  c_id: number;
  c_name: string;
  c_category: string;
  c_duration: number;
  c_price: number;
  c_description: string;
}

export default function EnrollUI({ course }: { course: Course }) {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gradeImage, setGradeImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGradeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-content, #print-content * { visibility: visible; }
          #print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 40px;
          }
          .print-header {
            background-color: #1e293b !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: white !important;
          }
        }
      `}</style>
      <div className="pt-36 px-6 min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="w-full max-w-3xl bg-white shadow-2xl border border-gray-200">
          {!enrolled ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!gradeImage) {
                  setError("Please upload your grade certificate");
                  return;
                }

                setLoading(true);
                setError(null);

                const formData = new FormData();
                formData.append("c_id", course.c_id.toString());
                formData.append("gradeImage", gradeImage);

                const res = await enrollCourse(formData);
                if (res.success) {
                  setEnrolled(true);
                } else {
                  setError(res.message || "Enroll failed");
                }
                setLoading(false);
              }}
            >
              <div className="p-16">
                <div className="border-b border-gray-200 pb-6 mb-12">
                  <div className="text-xs text-slate-700 uppercase tracking-[0.2em] mb-2 font-medium">Enrollment Form</div>
                  <h1 className="text-4xl font-light text-gray-900 tracking-tight">Course Registration</h1>
                </div>

                <div className="space-y-8">
                  <div className="border-l-2 border-slate-700 pl-6">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Course Title</div>
                    <div className="text-2xl font-light text-gray-900 leading-tight">{course.c_name}</div>
                  </div>

                  <div className="border-l-2 border-slate-700 pl-6">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Overview</div>
                    <div className="text-base text-gray-700 leading-relaxed font-light">{course.c_description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="border-l-2 border-slate-700 pl-6">
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Category</div>
                      <div className="text-lg text-gray-800 font-light">{course.c_category}</div>
                    </div>
                    <div className="border-l-2 border-slate-700 pl-6">
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Duration</div>
                      <div className="text-lg text-gray-800 font-light">{course.c_duration} hours</div>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-8 mt-12">
                    <div className="text-xs text-slate-700 uppercase tracking-[0.3em] mb-3 font-medium">Investment</div>
                    <div className="text-3xl font-light text-slate-800 tracking-tight">RM {course.c_price}</div>
                  </div>

                  <div className="border-l-2 border-slate-700 pl-6 mt-8">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Grade Certificate *</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-sm file:font-medium file:bg-slate-800 file:text-white hover:file:bg-slate-900 file:cursor-pointer file:transition-all file:duration-300 file:uppercase file:tracking-wider"
                      required
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img src={imagePreview} alt="Grade preview" className="max-h-48 border border-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {error && <div className="mt-8 text-red-600 text-center bg-red-50 py-4 border border-red-200">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-12 py-5 bg-slate-800 text-white font-medium text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-slate-800/20"
                >
                  {loading ? "Processing" : "Confirm Enrollment"}
                </button>
              </div>
            </form>
          ) : (
            <div id="print-content">
              <div className="print-header bg-slate-800 py-12 px-12 border-b border-slate-900">
                <div className="text-xs text-slate-300 uppercase tracking-[0.3em] mb-3">Official Document</div>
                <h1 className="text-4xl font-light text-white tracking-tight mb-2">ZY UNIVERSITY</h1>
                <div className="text-sm text-slate-200 uppercase tracking-widest">Enrollment Notice</div>
              </div>

              <div className="p-12">
                <div className="mb-12 border-l-4 border-amber-600 pl-6 py-4 bg-amber-50">
                  <div className="text-xs text-amber-700 mb-2 uppercase tracking-widest">Status</div>
                  <div className="text-2xl font-light text-amber-700">Application Submitted</div>
                </div>

                <div className="space-y-6 mb-12">
                  <div className="flex border-b border-gray-200 pb-5">
                    <div className="w-48 text-xs text-gray-500 uppercase tracking-widest pt-1">Course Title</div>
                    <div className="flex-1 text-lg font-light text-gray-900">{course.c_name}</div>
                  </div>
                  <div className="flex border-b border-gray-200 pb-5">
                    <div className="w-48 text-xs text-gray-500 uppercase tracking-widest pt-1">Description</div>
                    <div className="flex-1 text-base text-gray-700 font-light">{course.c_description}</div>
                  </div>
                  <div className="flex border-b border-gray-200 pb-5">
                    <div className="w-48 text-xs text-gray-500 uppercase tracking-widest pt-1">Category</div>
                    <div className="flex-1 text-base text-gray-800 font-light">{course.c_category}</div>
                  </div>
                  <div className="flex border-b border-gray-200 pb-5">
                    <div className="w-48 text-xs text-gray-500 uppercase tracking-widest pt-1">Duration</div>
                    <div className="flex-1 text-base text-gray-800 font-light">{course.c_duration} hours</div>
                  </div>
                  <div className="flex border-b border-gray-200 pb-5">
                    <div className="w-48 text-xs text-gray-500 uppercase tracking-widest pt-1">Investment</div>
                    <div className="flex-1 text-2xl font-light text-slate-800">RM {course.c_price}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-12 p-6 bg-amber-50 border-l-2 border-amber-600 italic font-light leading-relaxed">
                  Your enrollment application has been submitted successfully. Please wait for staff approval. You will be notified once your application is reviewed.
                </div>

                <div className="flex justify-end print:hidden">
                  <button
                    onClick={() => window.location.href = '/enroll_course'}
                    className="px-12 py-4 bg-slate-800 text-white font-medium text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all duration-300 shadow-lg shadow-slate-800/20"
                  >
                    Back to Courses
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
