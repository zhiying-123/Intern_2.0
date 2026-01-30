"use client";

import { useState } from "react";
import { createSubject, updateSubject, deleteSubject, updateSubjectStatus } from "./m_subject";

interface Subject {
    s_id: number;
    s_name: string;
    s_duration: number;
    s_status: string;
    course_subjects: Array<{
        course: {
            c_id: number;
            c_name: string;
        };
    }>;
}

export default function SubjectManagementUI({ subjects: initialSubjects }: { subjects: Subject[] }) {
    const [subjects, setSubjects] = useState(initialSubjects);
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<Subject | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        duration: 0,
        status: "AVAILABLE"
    });

    const resetForm = () => {
        setFormData({ name: "", duration: 0, status: "AVAILABLE" });
        setEditingSubject(null);
        setShowModal(false);
    };

    const handleCreate = async () => {
        if (!formData.name || formData.duration <= 0) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const result = await createSubject(formData.name, formData.duration);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
    };

    const handleUpdate = async () => {
        if (!editingSubject || !formData.name || formData.duration <= 0) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        const updateResult = await updateSubject(editingSubject.s_id, formData.name, formData.duration);

        if (updateResult.success && formData.status !== editingSubject.s_status) {
            await updateSubjectStatus(editingSubject.s_id, formData.status);
        }

        setLoading(false);

        if (updateResult.success) {
            alert("✅ Subject updated successfully");
            window.location.reload();
        } else {
            alert("❌ " + updateResult.message);
        }
    };

    const handleDelete = async (subject: Subject) => {
        setLoading(true);
        const result = await deleteSubject(subject.s_id);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            window.location.reload();
        } else {
            alert("❌ " + result.message);
        }
        setDeleteConfirm(null);
    };

    const openEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.s_name,
            duration: subject.s_duration,
            status: subject.s_status
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
                    <p className="text-sm text-gray-500">Manage course subjects</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-linear-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-800 px-4 py-2 rounded-2xl font-medium transition-colors shadow-sm"
                >
                    New Subject
                </button>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.length === 0 ? (
                    <div className="col-span-3 bg-white rounded-3xl p-12 text-center shadow-md">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-600 text-lg">No subjects found. Create your first subject!</p>
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <div key={subject.s_id} className="bg-linear-to-br from-white to-purple-50 rounded-2xl border border-purple-100 p-6 hover:shadow-lg transition-shadow">
                            {/* Subject Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.s_name}</h3>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${subject.s_status === 'AVAILABLE'
                                        ? 'bg-gray-100 text-gray-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {subject.s_status === 'AVAILABLE' ? '✓ Available' : '✕ Unavailable'}
                                    </span>
                                </div>
                            </div>

                            {/* Duration Card */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Credit Hours</span>
                                    <span className="text-gray-900 font-medium">{subject.s_duration}</span>
                                </div>
                            </div>

                            {/* Used in Courses */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">
                                        Linked Courses <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded ml-1">{subject.course_subjects.length}</span>
                                    </h4>
                                </div>
                                {subject.course_subjects.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Not used in any course yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {subject.course_subjects.slice(0, 3).map((cs, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded p-2">
                                                <p className="text-sm font-medium text-gray-900">{cs.course.c_name}</p>
                                            </div>
                                        ))}
                                        {subject.course_subjects.length > 3 && (
                                            <p className="text-xs text-gray-500">
                                                +{subject.course_subjects.length - 3} more...
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => openEdit(subject)}
                                    className="flex-1 bg-linear-to-r from-purple-100 to-purple-200 text-purple-800 py-2 rounded-lg font-medium hover:from-purple-200 hover:to-purple-300 transition-colors shadow-sm"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(subject)}
                                    disabled={loading}
                                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-linear-to-br from-white via-purple-50 to-purple-100 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-purple-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {editingSubject ? "Edit Subject" : "Create New Subject"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Mathematics"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Credit Hours) *</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    min="1"
                                    placeholder="e.g., 3"
                                />
                            </div>

                            {editingSubject && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="UNAVAILABLE">Unavailable</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                disabled={loading}
                                className="flex-1 bg-white/60 hover:bg-white text-purple-800 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingSubject ? handleUpdate : handleCreate}
                                disabled={loading}
                                className="flex-1 bg-linear-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-800 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {loading ? "Saving..." : (editingSubject ? "Update" : "Create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-linear-to-br from-white via-purple-50 to-purple-100 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-purple-100">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>{deleteConfirm.s_name}</strong>?
                            </p>
                            {deleteConfirm.course_subjects.length > 0 && (
                                <div className="bg-red-50 rounded-2xl p-4 mt-4">
                                    <p className="text-sm text-red-700">
                                        ⚠️ This subject is used in {deleteConfirm.course_subjects.length} course(s). You must remove it from all courses before deleting.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={loading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={loading}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
