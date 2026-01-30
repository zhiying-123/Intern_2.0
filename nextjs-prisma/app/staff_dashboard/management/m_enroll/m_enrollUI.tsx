"use client";

import { useState } from "react";
import { approveEnrollment, rejectEnrollment } from "./m_enroll";

interface EnrollmentData {
    sc_id: number;
    status: string;
    enrollment_date: Date;
    grade_image: string | null;
    user: {
        u_id: number;
        email: string;
        name: string;
        student_courses: Array<{
            status: string;
            course: {
                c_id: number;
                c_name: string;
                c_duration: number;
            };
        }>;
    };
    course: {
        c_id: number;
        c_name: string;
        c_description?: string;
        c_duration: number;
        c_price: number;
        c_category: string;
        course_subjects: Array<{
            subject: {
                s_id: number;
                s_name: string;
                s_duration: number;
            };
        }>;
    };
}

export default function EnrollmentManagementUI({ enrollments: initialEnrollments }: { enrollments: EnrollmentData[] }) {
    const [enrollments, setEnrollments] = useState(initialEnrollments);
    const [loading, setLoading] = useState<number | null>(null);
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentData | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleApprove = async (enrollmentId: number) => {
        setLoading(enrollmentId);
        const result = await approveEnrollment(enrollmentId);
        setLoading(null);

        if (result.success) {
            setEnrollments(enrollments.filter(e => e.sc_id !== enrollmentId));
            setSelectedEnrollment(null);
            alert("✅ Enrollment approved successfully!");
        } else {
            alert("❌ " + result.message);
        }
    };

    const handleReject = async (enrollmentId: number) => {
        setLoading(enrollmentId);
        const result = await rejectEnrollment(enrollmentId);
        setLoading(null);

        if (result.success) {
            setEnrollments(enrollments.filter(e => e.sc_id !== enrollmentId));
            setSelectedEnrollment(null);
            alert("✅ Enrollment disapproved");
        } else {
            alert("❌ " + result.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Enrollment Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Review and approve student applications</p>
                </div>
            </div>

            {/* Enrollments List */}
            <div className="grid grid-cols-1 gap-4">
                {enrollments.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-gray-500">No pending applications</p>
                    </div>
                ) : (
                    enrollments.map((enrollment) => (
                        <div
                            key={enrollment.sc_id}
                            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6 cursor-pointer"
                            onClick={() => setSelectedEnrollment(enrollment)}
                        >
                            <div className="flex items-start justify-between gap-6">
                                {/* Left: Student Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-200 to-pink-300 flex items-center justify-center text-purple-900 text-lg font-semibold shrink-0 shadow-sm">
                                        {enrollment.user.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-gray-900">{enrollment.user.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{enrollment.user.email}</p>
                                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                                            {enrollment.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Middle: Course Info */}
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">Applying for</div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{enrollment.course.c_name}</h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{enrollment.course.c_duration} hrs</span>
                                        <span>${enrollment.course.c_price}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded">{enrollment.course.c_category}</span>
                                    </div>
                                    {enrollment.user.student_courses.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {enrollment.user.student_courses.length} previous course(s)
                                        </p>
                                    )}
                                    {enrollment.grade_image && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImagePreview(enrollment.grade_image);
                                            }}
                                            className="mt-3 px-4 py-1.5 bg-linear-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800 text-xs font-medium rounded-lg transition-all shadow-sm"
                                        >
                                            📄 View Certificate
                                        </button>
                                    )}
                                </div>

                                {/* Right: Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleApprove(enrollment.sc_id);
                                        }}
                                        disabled={loading === enrollment.sc_id}
                                        className="px-6 py-2 bg-green-200 hover:bg-green-300 text-green-800 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading === enrollment.sc_id ? "..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReject(enrollment.sc_id);
                                        }}
                                        disabled={loading === enrollment.sc_id}
                                        className="px-6 py-2 bg-red-200 hover:bg-red-300 text-red-800 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading === enrollment.sc_id ? "..." : "Disapprove"}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                Applied {new Date(enrollment.enrollment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedEnrollment && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedEnrollment(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>

                        <div className="space-y-6">
                            {/* Student Details */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Student Information</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Name</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedEnrollment.user.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Email</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedEnrollment.user.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedEnrollment.user.u_id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Grade Certificate Image */}
                            {selectedEnrollment.grade_image && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Grade Certificate</h3>
                                    <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                                        <img
                                            src={selectedEnrollment.grade_image}
                                            alt="Grade Certificate"
                                            className="w-full max-h-72 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-blue-100"
                                            onClick={() => setImagePreview(selectedEnrollment.grade_image)}
                                        />
                                        <p className="text-xs text-blue-600 mt-2 text-center font-medium">Click to view full size</p>
                                    </div>
                                </div>
                            )}

                            {/* Course Details */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Course Information</h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-lg font-semibold text-gray-900 mb-2">{selectedEnrollment.course.c_name}</p>
                                    <p className="text-sm text-gray-600 mb-4">{selectedEnrollment.course.c_description}</p>
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Duration</span>
                                            <p className="font-medium text-gray-900">{selectedEnrollment.course.c_duration} hrs</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Price</span>
                                            <p className="font-medium text-gray-900">${selectedEnrollment.course.c_price}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Category</span>
                                            <p className="font-medium text-gray-900">{selectedEnrollment.course.c_category}</p>
                                        </div>
                                    </div>

                                    {selectedEnrollment.course.course_subjects.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Subjects</p>
                                            <div className="space-y-2">
                                                {selectedEnrollment.course.course_subjects.map((cs, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm bg-white px-3 py-2 rounded-lg">
                                                        <span className="text-gray-900">{cs.subject.s_name}</span>
                                                        <span className="text-gray-500">{cs.subject.s_duration} hrs</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enrollment History */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Previous Enrollments</h3>
                                {selectedEnrollment.user.student_courses.length === 0 ? (
                                    <p className="text-sm text-gray-500">No previous enrollments</p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedEnrollment.user.student_courses.map((sc, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm font-medium text-gray-900">{sc.course.c_name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{sc.course.c_duration} hrs • {sc.status}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedEnrollment(null)}
                            className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-medium transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {imagePreview && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4 backdrop-blur-md"
                    onClick={() => setImagePreview(null)}
                >
                    <div className="relative max-w-2xl max-h-[80vh] w-full">
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                        >
                            ✕ Close
                        </button>
                        <img
                            src={imagePreview}
                            alt="Certificate Preview"
                            className="w-full h-auto max-h-72 object-contain rounded-xl shadow-2xl mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
