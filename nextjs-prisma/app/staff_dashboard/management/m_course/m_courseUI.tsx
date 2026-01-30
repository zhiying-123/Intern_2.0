"use client";

import { useState } from "react";
import { createCourse, updateCourse, addSubjectToCourse, removeSubjectFromCourse } from "./m_course";

interface Subject {
    s_id: number;
    s_name: string;
    s_duration: number;
    s_status?: string;
}

interface Course {
    c_id: number;
    c_name: string;
    c_description?: string;
    c_duration: number;
    c_price: number;
    c_category: string;
    c_status: string;
    course_subjects: Array<{
        subject: Subject;
    }>;
}

export default function CourseManagementUI({
    courses: initialCourses,
    availableSubjects
}: {
    courses: Course[];
    availableSubjects: Subject[];
}) {
    const [courses, setCourses] = useState(initialCourses);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [managingSubjects, setManagingSubjects] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration: 0,
        price: 0,
        category: ""
    });

    const resetForm = () => {
        setFormData({ name: "", description: "", duration: 0, price: 0, category: "" });
        setEditingCourse(null);
        setShowCreateModal(false);
    };

    const handleCreate = async () => {
        if (!formData.name || formData.duration <= 0 || formData.price <= 0 || !formData.category) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const result = await createCourse(formData.name, formData.description, formData.duration, formData.price, formData.category);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
    };

    const handleUpdate = async () => {
        if (!editingCourse || !formData.name || formData.duration <= 0 || formData.price <= 0 || !formData.category) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const result = await updateCourse(editingCourse.c_id, formData.name, formData.description, formData.duration, formData.price, formData.category);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
    };

    const handleAddSubject = async (courseId: number, subjectId: number) => {
        setLoading(true);
        const result = await addSubjectToCourse(courseId, subjectId);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
    };

    const handleRemoveSubject = async (courseId: number, subjectId: number) => {
        if (!confirm("Are you sure you want to remove this subject?")) return;

        setLoading(true);
        const result = await removeSubjectFromCourse(courseId, subjectId);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
    };

    const openEdit = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            name: course.c_name,
            description: course.c_description || "",
            duration: course.c_duration,
            price: course.c_price,
            category: course.c_category
        });
        setShowCreateModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header - Simple and Clean */}
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                    <p className="text-sm text-gray-500">Organize your curriculum</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-linear-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800 px-4 py-2 rounded-2xl font-medium transition-colors shadow-sm"
                >
                    New Course
                </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-lg p-8 text-center border border-gray-200">
                        <p className="text-gray-500">No courses found. Create your first course!</p>
                    </div>
                ) : (
                    courses.map((course) => {
                        const totalSubjectDuration = course.course_subjects.reduce((sum, cs) => sum + cs.subject.s_duration, 0);
                        const remainingDuration = course.c_duration - totalSubjectDuration;

                        return (
                            <div key={course.c_id} className="bg-linear-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 hover:shadow-lg transition-shadow">
                                {/* Course Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{course.c_name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{course.c_description || "No description"}</p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{course.c_category}</span>
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${course.c_price}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openEdit(course)}
                                        className="p-2 bg-white/60 hover:bg-white text-blue-800 rounded-full shadow-sm ring-1 ring-white/50"
                                        title="Edit Course"
                                    >
                                        ✏️
                                    </button>
                                </div>

                                {/* Duration Info */}
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-600">Total Duration</span>
                                        <span className="text-gray-900 font-medium">{course.c_duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-600">Allocated</span>
                                        <span className="text-gray-900 font-medium">{totalSubjectDuration}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3 text-sm">
                                        <span className="text-gray-600">Remaining</span>
                                        <span className={`font-medium ${remainingDuration < 0 ? 'text-red-500' : 'text-blue-600'}`}>
                                            {remainingDuration}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">credit hours</p>
                                    {/* Progress Bar */}
                                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${remainingDuration < 0 ? 'bg-red-300' : 'bg-linear-to-r from-blue-100 to-cyan-100'}`}
                                            style={{ width: `${Math.min((totalSubjectDuration / Math.max(course.c_duration, 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div className="mb-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Subjects <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded ml-1">{course.course_subjects.length}</span>
                                        </h4>
                                        <button
                                            onClick={() => setManagingSubjects(course)}
                                            className="text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full hover:from-blue-150 hover:to-cyan-150 transition-colors shadow-sm"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    {course.course_subjects.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No subjects added yet</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {course.course_subjects.map((cs) => (
                                                <div key={cs.subject.s_id} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{cs.subject.s_name}</p>
                                                        <p className="text-xs text-gray-500">{cs.subject.s_duration} credit hours</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveSubject(course.c_id, cs.subject.s_id)}
                                                        disabled={loading}
                                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                                        title="Remove Subject"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-linear-to-br from-white via-blue-50 to-cyan-50 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-blue-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {editingCourse ? "Edit Course" : "New Course"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Computer Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Course description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Select Category</option>
                                    <option value="DIPLOMA">DIPLOMA</option>
                                    <option value="DEGREE">DEGREE</option>
                                    <option value="MASTER">MASTER</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours) *</label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        placeholder="e.g., 120"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                        step="0.01"
                                        placeholder="e.g., 1500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                disabled={loading}
                                className="flex-1 bg-white/60 hover:bg-white text-blue-800 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingCourse ? handleUpdate : handleCreate}
                                disabled={loading}
                                className="flex-1 bg-linear-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {loading ? "Saving..." : (editingCourse ? "Update" : "Create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Subjects Modal */}
            {managingSubjects && (
                <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-linear-to-br from-white via-blue-50 to-cyan-50 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>📚</span> Add Subjects
                            </h2>
                            <span className="text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {managingSubjects.c_duration - managingSubjects.course_subjects.reduce((sum, cs) => sum + cs.subject.s_duration, 0)} hrs left
                            </span>
                        </div>

                        <div className="space-y-2">
                            {availableSubjects.filter(subject =>
                                !managingSubjects.course_subjects.some(cs => cs.subject.s_id === subject.s_id) &&
                                subject.s_status === 'AVAILABLE'
                            ).map((subject) => {
                                const currentUsed = managingSubjects.course_subjects.reduce((sum, cs) => sum + cs.subject.s_duration, 0);
                                const canAdd = currentUsed + subject.s_duration <= managingSubjects.c_duration;

                                return (
                                    <div key={subject.s_id} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{subject.s_name}</p>
                                            <p className="text-xs text-gray-500">{subject.s_duration} credit hrs</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddSubject(managingSubjects.c_id, subject.s_id)}
                                            disabled={loading || !canAdd}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${canAdd
                                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            title={!canAdd ? 'Exceeds duration' : 'Add'}
                                        >
                                            {canAdd ? '+' : 'Full'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setManagingSubjects(null)}
                            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded text-sm font-medium transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
